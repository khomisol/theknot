# API Testing Patterns

## Principle

Test APIs and backend services directly without browser overhead. Use Playwright's `request` context for HTTP operations, `apiRequest` utility for enhanced features, and `recurse` for async operations. Pure API tests run faster, are more stable, and provide better coverage for service-layer logic.

## Rationale

Many teams over-rely on E2E/browser tests when API tests would be more appropriate:

- **Slower feedback**: Browser tests take seconds, API tests take milliseconds
- **More brittle**: UI changes break tests even when API works correctly
- **Wrong abstraction**: Testing business logic through UI layers adds noise
- **Resource heavy**: Browsers consume memory and CPU

API-first testing provides:

- **Fast execution**: No browser startup, no rendering, no JavaScript execution
- **Direct validation**: Test exactly what the service returns
- **Better isolation**: Test service logic independent of UI
- **Easier debugging**: Clear request/response without DOM noise
- **Contract validation**: Verify API contracts explicitly

## When to Use API Tests vs E2E Tests

| Scenario | API Test | E2E Test |
|----------|----------|----------|
| CRUD operations | ✅ Primary | ❌ Overkill |
| Business logic validation | ✅ Primary | ❌ Overkill |
| Error handling (4xx, 5xx) | ✅ Primary | ⚠️ Supplement |
| Authentication flows | ✅ Primary | ⚠️ Supplement |
| Data transformation | ✅ Primary | ❌ Overkill |
| User journeys | ❌ Can't test | ✅ Primary |
| Visual regression | ❌ Can't test | ✅ Primary |
| Cross-browser issues | ❌ Can't test | ✅ Primary |

**Rule of thumb**: If you're testing what the server returns (not how it looks), use API tests.

## Pattern Examples

### Example 1: Pure API Test (No Browser)

**Context**: Test REST API endpoints directly without any browser context.

**Implementation**:

```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';

// No page, no browser - just API
test.describe('Users API', () => {
  test('should create user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      },
    });

    expect(response.status()).toBe(201);

    const user = await response.json();
    expect(user.id).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('should get user by ID', async ({ request }) => {
    // Create user first
    const createResponse = await request.post('/api/users', {
      data: { name: 'Jane Doe', email: 'jane@example.com' },
    });
    const { id } = await createResponse.json();

    // Get user
    const getResponse = await request.get(`/api/users/${id}`);
    expect(getResponse.status()).toBe(200);

    const user = await getResponse.json();
    expect(user.id).toBe(id);
    expect(user.name).toBe('Jane Doe');
  });

  test('should return 404 for non-existent user', async ({ request }) => {
    const response = await request.get('/api/users/non-existent-id');
    expect(response.status()).toBe(404);

    const error = await response.json();
    expect(error.code).toBe('USER_NOT_FOUND');
  });

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: { name: 'Missing Email' }, // email is required
    });

    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toContainEqual(
      expect.objectContaining({ field: 'email', message: expect.any(String) })
    );
  });
});
```

**Key Points**:

- No `page` fixture needed - only `request`
- Tests run without browser overhead
- Direct HTTP assertions
- Clear error handling tests

### Example 2: Microservice-to-Microservice Testing

**Context**: Test service interactions without browser - validate API contracts between services.

**Implementation**:

```typescript
// tests/api/service-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Service Integration', () => {
  const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
  const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

  test('order service should validate user exists', async ({ request }) => {
    // Create user in user-service
    const userResponse = await request.post(`${USER_SERVICE_URL}/api/users`, {
      data: { name: 'Test User', email: 'test@example.com' },
    });
    const user = await userResponse.json();

    // Create order in order-service (should validate user via user-service)
    const orderResponse = await request.post(`${ORDER_SERVICE_URL}/api/orders`, {
      data: {
        userId: user.id,
        items: [{ productId: 'prod-1', quantity: 1 }],
      },
    });

    expect(orderResponse.status()).toBe(201);
    const order = await orderResponse.json();
    expect(order.userId).toBe(user.id);
  });

  test('order service should reject invalid user', async ({ request }) => {
    const response = await request.post(`${ORDER_SERVICE_URL}/api/orders`, {
      data: {
        userId: 'non-existent-user',
        items: [{ productId: 'prod-1', quantity: 1 }],
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.code).toBe('INVALID_USER');
  });
});
```

**Key Points**:

- Multiple service URLs for microservice testing
- Tests service-to-service communication
- No browser needed for full integration testing

### Example 3: GraphQL API Testing

**Context**: Test GraphQL endpoints with queries and mutations.

**Implementation**:

```typescript
// tests/api/graphql.spec.ts
import { test, expect } from '@playwright/test';

const GRAPHQL_ENDPOINT = '/graphql';

test.describe('GraphQL API', () => {
  test('should query users', async ({ request }) => {
    const query = `
      query GetUsers($limit: Int) {
        users(limit: $limit) {
          id
          name
          email
          role
        }
      }
    `;

    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query,
        variables: { limit: 10 },
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.users).toHaveLength(10);
    expect(body.data.users[0]).toHaveProperty('id');
    expect(body.data.users[0]).toHaveProperty('name');
  });

  test('should create user via mutation', async ({ request }) => {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    `;

    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: mutation,
        variables: {
          input: {
            name: 'GraphQL User',
            email: 'graphql@example.com',
          },
        },
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.createUser.id).toBeDefined();
    expect(body.data.createUser.name).toBe('GraphQL User');
  });

  test('should handle GraphQL errors', async ({ request }) => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `;

    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query,
        variables: { id: 'non-existent' },
      },
    });

    expect(response.status()).toBe(200); // GraphQL returns 200 even for errors
    const body = await response.json();
    expect(body.errors).toBeDefined();
    expect(body.errors[0].message).toContain('not found');
    expect(body.data.user).toBeNull();
  });
});
```

**Key Points**:

- GraphQL queries and mutations via POST
- Variables passed in request body
- GraphQL returns 200 even for errors (check `body.errors`)
- Test validation and business logic errors

### Example 4: Service Authentication (No Browser)

**Context**: Test authenticated API endpoints using tokens directly - no browser login needed.

**Implementation**:

```typescript
// tests/api/authenticated.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authenticated API Tests', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Get token via API (no browser!)
    const response = await request.post('/api/auth/login', {
      data: {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
    });

    const { token } = await response.json();
    authToken = token;
  });

  test('should access protected endpoint with token', async ({ request }) => {
    const response = await request.get('/api/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.email).toBe(process.env.TEST_USER_EMAIL);
  });

  test('should reject request without token', async ({ request }) => {
    const response = await request.get('/api/me');

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.code).toBe('UNAUTHORIZED');
  });

  test('should reject expired token', async ({ request }) => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Expired token

    const response = await request.get('/api/me', {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.code).toBe('TOKEN_EXPIRED');
  });

  test('should handle role-based access', async ({ request }) => {
    // User token (non-admin)
    const response = await request.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(403); // Forbidden for non-admin
  });
});
```

**Key Points**:

- Token obtained via API login (no browser)
- Token reused across all tests in describe block
- Test auth, expired tokens, and RBAC
- Pure API testing without UI

## API Test Configuration

### Playwright Config for API-Only Tests

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',

  // No browser needed for API tests
  use: {
    baseURL: process.env.API_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Faster without browser overhead
  timeout: 30000,

  // Run API tests in parallel
  workers: 4,
  fullyParallel: true,

  // No screenshots/traces needed for API tests
  reporter: [['html'], ['json', { outputFile: 'api-test-results.json' }]],
});
```

### Separate API Test Project

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_URL,
      },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        baseURL: process.env.APP_URL,
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
```

## Comparison: API Tests vs E2E Tests

| Aspect | API Test | E2E Test |
|--------|----------|----------|
| **Speed** | ~50-100ms per test | ~2-10s per test |
| **Stability** | Very stable | More flaky (UI timing) |
| **Setup** | Minimal | Browser, context, page |
| **Debugging** | Clear request/response | DOM, screenshots, traces |
| **Coverage** | Service logic | User experience |
| **Parallelization** | Easy (stateless) | Complex (browser resources) |
| **CI Cost** | Low (no browser) | High (browser containers) |

## Related Fragments

- `api-request.md` - apiRequest utility details
- `recurse-polling.md` - Polling patterns for async operations
- `auth-session.md` - Token management
- `contract-testing.md` - Pact contract testing
- `test-levels.md` - When to use which test level
- `data-factories.md` - Test data setup patterns

## Anti-Patterns

**DON'T use E2E for API validation:**

```typescript
// Bad: Testing API through UI
test('validate user creation', async ({ page }) => {
  await page.goto('/admin/users');
  await page.fill('#name', 'John');
  await page.click('#submit');
  await expect(page.getByText('User created')).toBeVisible();
});
```

**DO test APIs directly:**

```typescript
// Good: Direct API test
test('validate user creation', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'John' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toBeDefined();
});
```

**DON'T ignore API tests because "E2E covers it":**

```typescript
// Bad thinking: "Our E2E tests create users, so API is tested"
// Reality: E2E tests one happy path; API tests cover edge cases
```

**DO have dedicated API test coverage:**

```typescript
// Good: Explicit API test suite
test.describe('Users API', () => {
  test('creates user', async ({ request }) => { /* ... */ });
  test('handles duplicate email', async ({ request }) => { /* ... */ });
  test('validates required fields', async ({ request }) => { /* ... */ });
  test('handles malformed JSON', async ({ request }) => { /* ... */ });
  test('rate limits requests', async ({ request }) => { /* ... */ });
});
```

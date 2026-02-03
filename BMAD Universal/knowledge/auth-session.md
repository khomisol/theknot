# Auth Session Management

> **Purpose**: Patterns for efficient authentication in E2E tests, reducing login overhead while maintaining test isolation.

---

## Core Concepts

### Session Reuse Strategy

**Why Session Reuse Matters**:
- Login flows often take 3-5 seconds each
- Test suites with 100+ tests would spend 5-8 minutes just logging in
- Session reuse can reduce auth overhead by 90%+

### Storage State Pattern

Playwright's `storageState` captures:
- Cookies (session tokens, CSRF tokens)
- localStorage (JWT tokens, user preferences)
- sessionStorage (temporary auth data)

---

## Implementation Patterns

### Global Setup for Auth

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Perform login once
  await page.goto('/login');
  await page.fill('[data-testid="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('[data-testid="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('[data-testid="login-button"]');
  
  // Wait for auth to complete
  await page.waitForURL('/dashboard');
  
  // Save authenticated state
  await page.context().storageState({ path: './auth/user.json' });
  
  await browser.close();
}

export default globalSetup;
```

### Using Saved Auth State

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  projects: [
    {
      name: 'authenticated',
      use: {
        storageState: './auth/user.json',
      },
    },
    {
      name: 'unauthenticated',
      use: {
        storageState: { cookies: [], origins: [] },
      },
    },
  ],
});
```

---

## Multi-User Testing

### Role-Based Auth Files

```typescript
// global-setup.ts
const users = [
  { role: 'admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  { role: 'user', email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
  { role: 'readonly', email: process.env.READONLY_EMAIL, password: process.env.READONLY_PASSWORD },
];

async function globalSetup() {
  const browser = await chromium.launch();
  
  for (const user of users) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await loginAs(page, user.email, user.password);
    await context.storageState({ path: `./auth/${user.role}.json` });
    
    await context.close();
  }
  
  await browser.close();
}
```

### Project Configuration for Roles

```typescript
// playwright.config.ts
projects: [
  {
    name: 'admin-tests',
    testMatch: '**/admin/**/*.spec.ts',
    use: { storageState: './auth/admin.json' },
  },
  {
    name: 'user-tests',
    testMatch: '**/user/**/*.spec.ts',
    use: { storageState: './auth/user.json' },
  },
],
```

---

## Token Refresh Handling

### Auto-Refresh Pattern

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Check if token needs refresh before test
    const tokenExpiry = await page.evaluate(() => {
      const token = localStorage.getItem('authToken');
      if (!token) return 0;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    });
    
    if (tokenExpiry < Date.now() + 60000) {
      // Token expires within 1 minute, refresh it
      await page.goto('/api/refresh-token');
    }
    
    await use(page);
  },
});
```

---

## Worker-Scoped Auth

### Isolated Auth per Worker

```typescript
// fixtures/worker-auth.fixture.ts
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  workerStorageState: [async ({ browser }, use, workerInfo) => {
    const id = workerInfo.workerIndex;
    const fileName = `./auth/worker-${id}.json`;
    
    // Each worker gets its own user account
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/login');
    await page.fill('[data-testid="email"]', `test-user-${id}@example.com`);
    await page.fill('[data-testid="password"]', 'test-password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    
    await context.storageState({ path: fileName });
    await context.close();
    
    await use(fileName);
  }, { scope: 'worker' }],
  
  page: async ({ browser, workerStorageState }, use) => {
    const context = await browser.newContext({ storageState: workerStorageState });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

---

## Security Considerations

### Sensitive Data Handling

```typescript
// ❌ Don't commit auth files
// .gitignore
auth/*.json

// ✅ Generate auth files in CI
// ci-setup.sh
mkdir -p auth
npx playwright test --project=setup
```

### Environment Variables

```yaml
# CI environment variables (encrypted)
TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Login in every test | Slow, wasteful | Use storageState |
| Shared mutable user | Test pollution | Worker-scoped accounts |
| Hardcoded credentials | Security risk | Environment variables |
| No token refresh | Flaky on long runs | Auto-refresh pattern |
| Single admin account | Parallel conflicts | Pool of test accounts |

---

## Checklist

- [ ] Global setup creates auth state files
- [ ] Each user role has dedicated auth file
- [ ] Auth files excluded from version control
- [ ] Credentials stored in environment variables
- [ ] Token refresh handled for long test runs
- [ ] Parallel workers have isolated accounts
- [ ] Unauthenticated tests have clean state

---

## Related Knowledge

- [Fixture Architecture](fixture-architecture.md) - Composing auth fixtures
- [Data Factories](data-factories.md) - Creating test user accounts
- [Network First](network-first.md) - API-based auth setup

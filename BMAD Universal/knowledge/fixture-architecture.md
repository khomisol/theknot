# Fixture Architecture

## Principle

Build test helpers as pure functions first, then wrap them in framework-specific fixtures. Compose capabilities using `mergeTests` (Playwright) or layered commands (Cypress) instead of inheritance. Each fixture should solve one isolated concern (auth, API, logs, network).

---

## Why This Matters

Traditional Page Object Models create tight coupling through inheritance chains (`BasePage → LoginPage → AdminPage`). When base classes change, all descendants break.

Pure functions with fixture wrappers provide:
- **Testability**: Pure functions run in unit tests without framework overhead
- **Composability**: Mix capabilities freely via `mergeTests`, no inheritance constraints
- **Reusability**: Export fixtures via package subpaths for cross-project sharing
- **Maintainability**: One concern per fixture = clear responsibility boundaries

---

## Pattern 1: Pure Function → Fixture

Always start with a pure function, then wrap it in a fixture.

```typescript
// Step 1: Pure function (ALWAYS FIRST!)
// helpers/api-request.ts
type ApiRequestParams = {
  request: APIRequestContext;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest({
  request,
  method,
  url,
  data,
  headers = {}
}: ApiRequestParams) {
  const response = await request.fetch(url, {
    method,
    data,
    headers: { 'Content-Type': 'application/json', ...headers }
  });

  if (!response.ok()) {
    throw new Error(`API request failed: ${response.status()}`);
  }
  return response.json();
}

// Step 2: Fixture wrapper
// fixtures/api-request-fixture.ts
import { test as base } from '@playwright/test';
import { apiRequest } from '../helpers/api-request';

export const test = base.extend<{ apiRequest: typeof apiRequest }>({
  apiRequest: async ({ request }, use) => {
    await use((params) => apiRequest({ request, ...params }));
  }
});
```

**Key Points:**
- Pure function is unit-testable without Playwright running
- Framework dependency (`request`) injected at fixture boundary
- Fixture exposes the pure function to test context

---

## Pattern 2: Composable Fixtures with mergeTests

Compose multiple focused fixtures instead of monolithic helper classes.

```typescript
// fixtures/merged-fixtures.ts
import { test as base, mergeTests } from '@playwright/test';
import { test as apiRequestFixture } from './api-request-fixture';
import { test as networkFixture } from './network-fixture';
import { test as authFixture } from './auth-fixture';

export const test = mergeTests(
  base,
  apiRequestFixture,
  networkFixture,
  authFixture
);

export { expect } from '@playwright/test';

// Usage in tests:
test('user can create order', async ({ page, apiRequest, auth, network }) => {
  await auth.loginAs('customer@example.com');
  await network.interceptRoute('POST', '**/api/orders', { id: 123 });
  await page.goto('/checkout');
  await page.click('[data-testid="submit-order"]');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

---

## Pattern 3: Auto-Cleanup Fixtures

Track created resources and clean up automatically.

```typescript
// fixtures/database-fixture.ts
export const test = base.extend<{ seedUser: (data: Partial<User>) => Promise<User> }>({
  seedUser: async ({}, use) => {
    const createdUsers: string[] = [];

    const seedUser = async (userData: Partial<User>) => {
      const user = await seedDatabase('users', userData);
      createdUsers.push(user.id); // Track for cleanup
      return user;
    };

    await use(seedUser);

    // Auto-cleanup after test
    for (const userId of createdUsers) {
      await deleteRecord('users', userId);
    }
  },
});
```

---

## Anti-Pattern: Inheritance-Based Page Objects

```typescript
// ❌ BAD: Page Object Model with inheritance
class BasePage {
  constructor(public page: Page) {}
  async navigate(url: string) { await this.page.goto(url); }
}

class LoginPage extends BasePage {
  async login(email: string, password: string) {
    await this.navigate('/login');
    await this.page.fill('#email', email);
    // ...
  }
}

class AdminPage extends LoginPage {
  async accessAdminPanel() {
    await this.login('admin@example.com', 'admin123');
    // ...
  }
}
```

**Problems:**
- Changes to `BasePage` break all descendants
- Cannot compose capabilities (admin + reporting = multiple inheritance)
- Hidden state in class instances

**Better:**
```typescript
// ✅ GOOD: Pure functions + fixtures
export async function login(page: Page, email: string, password: string) {
  await page.fill('[data-testid="email"]', email);
  await page.fill('[data-testid="password"]', password);
  await page.click('[data-testid="submit"]');
}

export const test = base.extend({
  adminPage: async ({ page }, use) => {
    await login(page, 'admin@example.com', 'admin123');
    await use(page);
  },
});
```

---

## Helper Function Reuse Guidelines

| Usage Count | Approach |
|-------------|----------|
| 3+ uses | Create fixture with subpath export |
| 2-3 uses | Create utility module |
| 1 use | Keep inline (avoid premature abstraction) |
| Complex logic | Factory function pattern |

---

## Related Knowledge

- `data-factories.md` - Factory functions for test data
- `network-first.md` - Network interception patterns
- `test-quality.md` - Deterministic test design

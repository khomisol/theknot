# Data Factories and API-First Setup

## Principle

Prefer factory functions that accept overrides and return complete objects (`createUser(overrides)`). Seed test state through APIs, tasks, or direct DB helpers before visiting the UI—never via slow UI interactions. UI is for validation only, not setup.

---

## Why This Matters

Static fixtures (JSON files, hardcoded objects) create brittle tests that:
- Fail when schemas evolve (missing new required fields)
- Cause collisions in parallel execution (same user IDs)
- Hide test intent (what matters for _this_ test?)

Dynamic factories provide:
- **Parallel safety**: UUIDs and timestamps prevent collisions
- **Schema evolution**: Defaults adapt to schema changes automatically
- **Explicit intent**: Overrides show what matters for each test
- **Speed**: API setup is 10-50x faster than UI

---

## Pattern 1: Factory with Overrides

```typescript
// factories/user-factory.ts
import { faker } from '@faker-js/faker';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  isActive: boolean;
};

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'user',
  createdAt: new Date(),
  isActive: true,
  ...overrides,
});

// Usage:
const user = createUser();                           // Default user
const admin = createUser({ role: 'admin' });         // Admin (explicit intent)
const inactive = createUser({ isActive: false });    // Inactive user
```

**Key Points:**
- `Partial<User>` allows overriding any field
- Faker generates unique values—no collisions
- Override shows test intent clearly

---

## Pattern 2: Nested Factories

For relationships (orders with users and products):

```typescript
// factories/order-factory.ts
import { createUser } from './user-factory';
import { createProduct } from './product-factory';

type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user: User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped';
};

export const createOrderItem = (overrides: Partial<OrderItem> = {}): OrderItem => {
  const product = overrides.product || createProduct();
  const quantity = overrides.quantity || faker.number.int({ min: 1, max: 5 });
  return {
    product,
    quantity,
    price: product.price * quantity,
    ...overrides,
  };
};

export const createOrder = (overrides: Partial<Order> = {}): Order => {
  const items = overrides.items || [createOrderItem(), createOrderItem()];
  return {
    id: faker.string.uuid(),
    user: overrides.user || createUser(),
    items,
    total: items.reduce((sum, item) => sum + item.price, 0),
    status: 'pending',
    ...overrides,
  };
};

// Usage:
const user = createUser({ email: 'buyer@example.com' });
const order = createOrder({
  user,
  items: [createOrderItem({ quantity: 2 })],
});
```

---

## Pattern 3: API Seeding

Always seed via API, not UI:

```typescript
// helpers/seed-helpers.ts
export async function seedUser(
  request: APIRequestContext,
  overrides: Partial<User> = {}
): Promise<User> {
  const user = createUser(overrides);
  
  const response = await request.post('/api/users', { data: user });
  if (!response.ok()) {
    throw new Error(`Failed to seed user: ${response.status()}`);
  }
  
  return user;
}

// In tests:
test('admin can delete users', async ({ page, request }) => {
  // Seed via API (fast!)
  const user = await seedUser(request, { role: 'user' });
  const admin = await seedUser(request, { role: 'admin' });

  // Now test UI
  await page.goto('/admin/users');
  await page.click(`[data-testid="delete-${user.id}"]`);
  await expect(page.getByText('User deleted')).toBeVisible();
});
```

---

## Pattern 4: Composed Factories

Build specialized factories from base factories:

```typescript
// Specialized user factories
export const createAdminUser = (overrides: Partial<User> = {}): User =>
  createUser({ role: 'admin', ...overrides });

export const createModeratorUser = (overrides: Partial<User> = {}): User =>
  createUser({ role: 'moderator', ...overrides });

// Account-level factories
export const createAccount = (overrides: Partial<Account> = {}): Account => ({
  id: faker.string.uuid(),
  owner: overrides.owner || createUser(),
  plan: 'free',
  features: [],
  maxUsers: 1,
  ...overrides,
});

export const createProAccount = (overrides: Partial<Account> = {}): Account =>
  createAccount({
    plan: 'pro',
    features: ['analytics', 'priority-support'],
    maxUsers: 10,
    ...overrides,
  });
```

---

## Anti-Pattern: Hardcoded Data

```typescript
// ❌ BAD: Hardcoded test data
test('user can login - FLAKY', async ({ page }) => {
  await page.fill('[data-testid="email"]', 'test@test.com'); // Hardcoded!
  await page.fill('[data-testid="password"]', 'password123');
  // Fails in parallel: "Email already exists"
});

// ❌ BAD: Static JSON fixtures
const users = require('../fixtures/users.json');
// Brittle: IDs collide, schema drift breaks tests
```

**Better:**
```typescript
// ✅ GOOD: Factory-based
test('user can login', async ({ page, request }) => {
  const user = createUser({ password: 'secure123' });
  await request.post('/api/users', { data: user });

  await page.goto('/login');
  await page.fill('[data-testid="email"]', user.email);
  await page.fill('[data-testid="password"]', 'secure123');
  await page.click('[data-testid="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Cleanup Strategy

Track created resources for cleanup:

```typescript
const createdUsers: string[] = [];

afterEach(async ({ request }) => {
  for (const userId of createdUsers) {
    await request.delete(`/api/users/${userId}`);
  }
  createdUsers.length = 0;
});

test('user flow', async ({ page, request }) => {
  const user = createUser();
  createdUsers.push(user.id);
  await request.post('/api/users', { data: user });
  // ... test logic
});
```

---

## Related Knowledge

- `fixture-architecture.md` - Pure functions and fixture patterns
- `network-first.md` - API-first setup patterns
- `test-quality.md` - Parallel-safe, deterministic tests

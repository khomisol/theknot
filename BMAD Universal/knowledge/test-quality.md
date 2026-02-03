# Test Quality Definition of Done

## Principle

Tests must be deterministic, isolated, explicit, focused, and fast. Every test should execute in under 1.5 minutes, contain fewer than 300 lines, avoid hard waits and conditionals, keep assertions visible in test bodies, and clean up after itself for parallel execution.

---

## Why This Matters

Quality tests provide reliable signal about application health. Flaky tests erode confidence and waste engineering time.

**Problems with low-quality tests:**
- Hard waits (`waitForTimeout(3000)`) are non-deterministic and slow
- Hidden assertions become unmaintainable
- Large tests (>300 lines) are hard to understand and debug
- Slow tests (>1.5 min) block CI pipelines
- Tests that don't clean up cause pollution in parallel runs

---

## Pattern 1: Deterministic Tests

Eliminate all sources of non-determinism.

```typescript
// ❌ BAD: Non-deterministic
test('dashboard - FLAKY', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForTimeout(3000); // NEVER - arbitrary wait

  // Conditional flow control - behavior varies
  if (await page.locator('[data-testid="banner"]').isVisible()) {
    await page.click('[data-testid="dismiss"]');
  }

  // Try-catch for flow control - hides issues
  try {
    await page.click('[data-testid="load-more"]');
  } catch (e) {
    // Silently continues
  }
});

// ✅ GOOD: Deterministic
test('dashboard', async ({ page, apiRequest }) => {
  const user = createUser({ hasSeenWelcome: true }); // Control state
  await apiRequest.post('/api/users', { data: user });

  // Network-first: Intercept BEFORE navigate
  const dashboardPromise = page.waitForResponse('**/api/dashboard');
  await page.goto('/dashboard');
  await dashboardPromise; // Deterministic wait

  await expect(page.getByText(`Welcome, ${user.name}`)).toBeVisible();
});
```

**Rules:**
- Replace `waitForTimeout()` with `waitForResponse()` or element state checks
- Never use if/else to control test flow
- Avoid try-catch for flow control
- Use factories with controlled data

---

## Pattern 2: Isolated Tests with Cleanup

Tests must not leak state.

```typescript
// ❌ BAD: No cleanup - pollutes state
test('create user - POLLUTES', async ({ page }) => {
  await page.fill('[data-testid="email"]', 'newuser@example.com');
  await page.click('[data-testid="create"]');
  // NO CLEANUP - next run fails: "Email exists"
});

// ✅ GOOD: Auto-cleanup via fixture
export const test = base.extend({
  seedUser: async ({}, use) => {
    const createdUsers: string[] = [];

    const seedUser = async (userData: Partial<User>) => {
      const user = await seedDatabase('users', userData);
      createdUsers.push(user.id);
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

## Pattern 3: Explicit Assertions

Keep assertions visible in test bodies.

```typescript
// ❌ BAD: Hidden assertions
async function validateUserCreation(response: Response) {
  const user = await response.json();
  expect(response.status()).toBe(201);  // Hidden!
  expect(user.email).toBeTruthy();      // Hidden!
}

test('create user - OPAQUE', async ({ request }) => {
  const response = await request.post('/api/users', { data: user });
  await validateUserCreation(response); // What assertions run?
});

// ✅ GOOD: Explicit assertions
test('create user', async ({ request }) => {
  const response = await request.post('/api/users', { data: user });

  // All assertions visible
  expect(response.status()).toBe(201);
  
  const created = await response.json();
  expect(created.id).toBeTruthy();
  expect(created.email).toBe(user.email);
  expect(created.role).toBe('user');
});
```

**Rules:**
- Never hide `expect()` calls in helper functions
- Helpers can extract/transform data, but assertions stay in tests
- Explicit assertions make failures actionable

---

## Pattern 4: Focused Tests (<300 lines)

Split monolithic tests.

```typescript
// ❌ BAD: 400-line monolithic test
test('complete journey - TOO LONG', async ({ page }) => {
  // 100 lines of setup
  // 100 lines of user creation
  // 100 lines of permissions
  // 100 lines of cleanup
  // IMPOSSIBLE to debug
});

// ✅ GOOD: Split with shared fixture
export const test = base.extend({
  adminPage: async ({ page }, use) => {
    await login(page, 'admin@example.com');
    await use(page);
  },
});

test('admin can create user', async ({ adminPage }) => {
  // 50 lines - focused on user creation
});

test('admin can assign permissions', async ({ adminPage }) => {
  // 60 lines - focused on permissions
});

test('admin can update preferences', async ({ adminPage }) => {
  // 70 lines - focused on preferences
});
```

---

## Pattern 5: Fast Tests (<1.5 min)

Optimize execution time.

```typescript
// ❌ BAD: 4-minute test
test('order flow - SLOW', async ({ page }) => {
  // Manual signup via UI (90 seconds)
  await page.goto('/signup');
  // ... 20 form fields ...
  
  // Hard waits everywhere
  await page.waitForTimeout(5000);
});

// ✅ GOOD: 45-second test
test('order flow', async ({ page, apiRequest }) => {
  // Parallel API setup (5 seconds)
  const [user, product] = await Promise.all([
    apiRequest.post('/api/users', { data: createUser({ emailVerified: true }) }),
    apiRequest.post('/api/products', { data: createProduct() }),
  ]);

  // Auth via cookie (instant)
  await page.context().addCookies([
    { name: 'auth_token', value: user.token, domain: 'localhost', path: '/' }
  ]);

  // Network-first waits (deterministic)
  const orderPromise = page.waitForResponse('**/api/orders');
  await page.goto('/checkout');
  await page.click('[data-testid="submit"]');
  await orderPromise;
});
```

**Optimization strategies:**
- Use API for data setup (10-50x faster than UI)
- Run independent operations in parallel (`Promise.all`)
- Replace hard waits with deterministic waits
- Reuse auth sessions via `storageState`

---

## Quality Checklist

Every test must pass:

- [ ] **No Hard Waits** - Use `waitForResponse`, element state, not `waitForTimeout`
- [ ] **No Conditionals** - Tests execute same path every time
- [ ] **< 300 Lines** - Keep focused; split or extract setup
- [ ] **< 1.5 Minutes** - Optimize with API setup, parallel ops
- [ ] **Self-Cleaning** - Auto-cleanup via fixtures or `afterEach()`
- [ ] **Explicit Assertions** - Keep `expect()` in test bodies
- [ ] **Unique Data** - Use `faker`, never hardcode IDs/emails
- [ ] **Parallel-Safe** - No shared state; works with `--workers=4`

---

## Related Knowledge

- `network-first.md` - Deterministic waiting strategies
- `data-factories.md` - Isolated, parallel-safe data
- `fixture-architecture.md` - Setup extraction and cleanup
- `test-levels.md` - Choosing appropriate test granularity

# Network-First Safeguards

## Principle

Register network interceptions **before** any navigation or user action. Store the interception promise and await it immediately after the triggering step. Replace implicit waits with deterministic signals based on network responses.

---

## Why This Matters

The most common source of flaky E2E tests is **race conditions** between navigation and network interception:

- Navigate then intercept = missed requests (too late)
- No explicit wait = assertion runs before response arrives
- Hard waits (`waitForTimeout(3000)`) = slow, unreliable, brittle

Network-first patterns provide:
- **Zero race conditions**: Intercept is active before triggering action
- **Deterministic waits**: Wait for actual response, not arbitrary timeouts
- **Speed**: No padding with extra wait time

---

## Pattern 1: Intercept Before Navigate

```typescript
// ✅ CORRECT: Intercept BEFORE navigate
test('user can view dashboard', async ({ page }) => {
  // Step 1: Register interception FIRST
  const usersPromise = page.waitForResponse(
    resp => resp.url().includes('/api/users') && resp.status() === 200
  );

  // Step 2: THEN trigger the request
  await page.goto('/dashboard');

  // Step 3: THEN await the response
  const usersResponse = await usersPromise;
  const users = await usersResponse.json();

  // Step 4: Assert on structured data
  expect(users).toHaveLength(10);
  await expect(page.getByText(users[0].name)).toBeVisible();
});

// ❌ WRONG: Navigate BEFORE intercept (race condition!)
test('flaky test', async ({ page }) => {
  await page.goto('/dashboard'); // Request fires NOW
  const usersPromise = page.waitForResponse('/api/users'); // TOO LATE
  // May timeout randomly
});
```

**Cypress Equivalent:**
```javascript
cy.intercept('GET', '**/api/users').as('getUsers'); // FIRST
cy.visit('/dashboard');                              // THEN trigger
cy.wait('@getUsers');                                // THEN await
```

---

## Pattern 2: Network Stubbing for Edge Cases

```typescript
// Test happy path
test('order succeeds', async ({ page }) => {
  await page.route('**/api/orders', route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ orderId: '123', status: 'confirmed' }),
    })
  );

  await page.goto('/checkout');
  await page.click('[data-testid="submit"]');
  await expect(page.getByText('Order Confirmed')).toBeVisible();
});

// Test error handling
test('order fails with server error', async ({ page }) => {
  await page.route('**/api/orders', route =>
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    })
  );

  await page.goto('/checkout');
  await page.click('[data-testid="submit"]');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});

// Test timeout
test('order times out', async ({ page }) => {
  await page.route('**/api/orders', () => new Promise(() => {})); // Never resolves

  await page.goto('/checkout');
  await page.click('[data-testid="submit"]');
  await expect(page.getByText('Request timed out')).toBeVisible({ timeout: 15000 });
});
```

---

## Pattern 3: Deterministic Waiting

```typescript
// ✅ GOOD: Wait for response
const responsePromise = page.waitForResponse('**/api/users');
await page.goto('/dashboard');
await responsePromise;

// ✅ GOOD: Wait for multiple responses
const [users, products] = await Promise.all([
  page.waitForResponse('**/api/users'),
  page.waitForResponse('**/api/products'),
]);
await page.goto('/dashboard');

// ✅ GOOD: Wait for spinner to disappear
await page.goto('/dashboard');
await expect(page.getByTestId('loading-spinner')).not.toBeVisible();

// ❌ BAD: Hard wait
await page.goto('/dashboard');
await page.waitForTimeout(3000); // NEVER DO THIS
```

---

## Pattern 4: HAR Capture for Debugging

```typescript
// Capture real network traffic
test('capture network', async ({ page, context }) => {
  await context.routeFromHAR('./hars/order-flow.har', {
    url: '**/api/**',
    update: true, // Record new requests
  });

  await page.goto('/checkout');
  // HAR saved for analysis
});

// Replay HAR for deterministic tests
test('replay from HAR', async ({ page, context }) => {
  await context.routeFromHAR('./hars/order-flow.har', {
    url: '**/api/**',
    update: false, // Read-only
  });

  // Test runs with exact recorded responses
});
```

---

## Anti-Pattern: Navigate Then Mock

```typescript
// ❌ BAD: Race condition
await page.goto('/dashboard');           // Request fires NOW
await page.route('**/api/users', ...);   // TOO LATE

// ❌ BAD: No explicit wait
await page.route('**/api/users', ...);
await page.goto('/dashboard');
// Assertion runs immediately - may fail

// ✅ GOOD: Intercept → Promise → Trigger → Await → Assert
await page.route('**/api/users', route => route.fulfill(...));
const responsePromise = page.waitForResponse('**/api/users');
await page.goto('/dashboard');
await responsePromise;
await expect(page.getByText('User')).toBeVisible();
```

---

## Debugging Network Issues

```typescript
// Log all requests/responses
page.on('request', req => console.log('→', req.method(), req.url()));
page.on('response', resp => console.log('←', resp.status(), resp.url()));
```

Check:
1. Is interception registered **before** action?
2. Does URL pattern match actual request?
3. Is mocked response valid format?
4. Is app checking correct status code?

---

## Related Knowledge

- `fixture-architecture.md` - Network fixture patterns
- `data-factories.md` - API-first setup
- `test-quality.md` - Deterministic test principles

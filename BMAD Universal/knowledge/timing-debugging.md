# Timing Debugging

> **Purpose**: Patterns for identifying and fixing timing-related test failures including race conditions, flaky waits, and synchronization issues.

---

## Common Timing Issues

### Race Condition Categories

1. **Element not ready** - DOM exists but not interactive
2. **Data not loaded** - API response pending
3. **Animation in progress** - Element moving/transitioning
4. **State not updated** - React/Vue re-render pending
5. **Navigation incomplete** - Page still loading

---

## The Network-First Pattern

### Wait for Data, Not Time

```typescript
// ❌ Anti-pattern: Fixed timeout
await page.waitForTimeout(2000);
await page.click('[data-testid="submit"]');

// ✅ Correct: Wait for network
await page.goto('/dashboard');
await page.waitForResponse(resp => 
  resp.url().includes('/api/user') && resp.status() === 200
);
await page.click('[data-testid="submit"]');
```

### Network Idle Strategy

```typescript
// Wait for all network activity to settle
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// Or wait for specific requests
await Promise.all([
  page.waitForResponse('**/api/dashboard/**'),
  page.click('[data-testid="refresh"]'),
]);
```

---

## Auto-Waiting Best Practices

### Playwright's Built-in Waiting

```typescript
// Playwright auto-waits for:
// - Element to be attached to DOM
// - Element to be visible
// - Element to be stable (not animating)
// - Element to be enabled
// - Element to receive events

// These actions auto-wait:
await page.click('[data-testid="button"]');
await page.fill('[data-testid="input"]', 'text');
await page.check('[data-testid="checkbox"]');
```

### When Auto-Wait Isn't Enough

```typescript
// Element exists but data not loaded
await page.waitForSelector('[data-testid="user-list"] li');

// Wait for specific content
await expect(page.getByTestId('status')).toHaveText('Complete');

// Wait for element to be hidden
await expect(page.getByTestId('loading')).toBeHidden();
```

---

## Debugging Flaky Timing

### Identify the Race

```typescript
test('debug timing issue', async ({ page }) => {
  await page.goto('/app');
  
  // Add visibility into timing
  console.log('Before click:', Date.now());
  
  // Check element state before action
  const button = page.getByTestId('submit');
  console.log('Button visible:', await button.isVisible());
  console.log('Button enabled:', await button.isEnabled());
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'before-click.png' });
  
  await button.click();
  console.log('After click:', Date.now());
});
```

### Slow Motion Debugging

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Slow down all actions
    launchOptions: {
      slowMo: 100,  // 100ms delay between actions
    },
  },
});

// Or per-test:
test.use({ launchOptions: { slowMo: 500 } });
```

---

## Animation Handling

### Wait for Animations

```typescript
// Wait for CSS animation to complete
await page.locator('.modal').waitFor({ state: 'visible' });
await page.waitForFunction(() => {
  const modal = document.querySelector('.modal');
  return getComputedStyle(modal!).animationPlayState === 'paused' ||
         getComputedStyle(modal!).opacity === '1';
});

// Or disable animations globally
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `,
});
```

### Stable Element Check

```typescript
// Wait for element to stop moving
async function waitForStable(locator: Locator) {
  let prevBox = await locator.boundingBox();
  await page.waitForTimeout(100);
  
  while (true) {
    const currentBox = await locator.boundingBox();
    if (JSON.stringify(prevBox) === JSON.stringify(currentBox)) {
      break;
    }
    prevBox = currentBox;
    await page.waitForTimeout(50);
  }
}
```

---

## State Synchronization

### React/Vue State Updates

```typescript
// Wait for React state update
await page.click('[data-testid="increment"]');
await expect(page.getByTestId('counter')).toHaveText('1');

// Wait for computed/derived state
await page.fill('[data-testid="search"]', 'query');
await expect(page.getByTestId('results-count')).not.toHaveText('0');
```

### Custom State Waiter

```typescript
// Wait for app-specific ready state
await page.waitForFunction(() => {
  return (window as any).__APP_READY__ === true;
});

// Or wait for specific store state
await page.waitForFunction(() => {
  const store = (window as any).__REDUX_STORE__;
  return store.getState().user.isLoaded;
});
```

---

## Retry Patterns

### Assertion Retries

```typescript
// Built-in retry with expect
await expect(page.getByTestId('status')).toHaveText('Success', {
  timeout: 10000,  // Retry for up to 10 seconds
});

// Retry with polling
await expect.poll(async () => {
  const response = await page.request.get('/api/status');
  return (await response.json()).status;
}, {
  timeout: 30000,
  intervals: [1000, 2000, 5000],
}).toBe('complete');
```

### Custom Retry Logic

```typescript
async function retryUntil<T>(
  action: () => Promise<T>,
  predicate: (result: T) => boolean,
  options = { timeout: 10000, interval: 500 }
): Promise<T> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < options.timeout) {
    const result = await action();
    if (predicate(result)) {
      return result;
    }
    await new Promise(r => setTimeout(r, options.interval));
  }
  
  throw new Error('Retry timeout exceeded');
}

// Usage
const text = await retryUntil(
  () => page.getByTestId('status').textContent(),
  (text) => text === 'Complete'
);
```

---

## Timeout Configuration

### Granular Timeouts

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30000,  // Test timeout
  expect: {
    timeout: 5000,  // Assertion timeout
  },
  use: {
    actionTimeout: 10000,  // Click, fill, etc.
    navigationTimeout: 30000,  // goto, reload, etc.
  },
});
```

### Per-Action Timeout

```typescript
// Override timeout for slow operations
await page.click('[data-testid="slow-button"]', { timeout: 30000 });

await expect(page.getByTestId('large-table')).toBeVisible({ 
  timeout: 60000 
});
```

---

## Parallel Test Timing

### Worker Isolation

```typescript
// Avoid shared state timing issues
test.describe.configure({ mode: 'serial' });  // Run sequentially

// Or ensure proper isolation
test.beforeEach(async ({ page }) => {
  // Reset app state before each test
  await page.goto('/reset-state');
});
```

### Resource Contention

```typescript
// Use unique resources per worker
test('database operation', async ({ page }, workerInfo) => {
  const userId = `test-user-${workerInfo.workerIndex}`;
  await page.goto(`/user/${userId}`);
});
```

---

## Diagnostic Tools

### Timing Traces

```typescript
test('capture timing', async ({ page }) => {
  // Enable performance timing
  await page.goto('/app');
  
  const timing = await page.evaluate(() => {
    return JSON.stringify(performance.timing, null, 2);
  });
  
  await test.info().attach('performance-timing', {
    body: timing,
    contentType: 'application/json',
  });
});
```

### Network Timing

```typescript
test('measure api timing', async ({ page }) => {
  const requestTiming: Record<string, number> = {};
  
  page.on('request', request => {
    requestTiming[request.url()] = Date.now();
  });
  
  page.on('response', response => {
    const url = response.url();
    const duration = Date.now() - requestTiming[url];
    console.log(`${url}: ${duration}ms`);
  });
  
  await page.goto('/app');
});
```

---

## Common Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Clicks "miss" | Element animating | Wait for stable |
| Random failures | Race condition | Use network-first |
| Works locally, fails CI | Speed difference | Add explicit waits |
| Timeout on assertion | Slow response | Increase timeout |
| Parallel failures | Shared state | Worker isolation |

---

## Anti-Patterns

```typescript
// ❌ Never use fixed timeouts to "fix" flakiness
await page.waitForTimeout(3000);

// ❌ Don't catch and ignore timing errors
try { await page.click(btn); } catch {}

// ❌ Don't use very long timeouts as first solution
await expect(x).toBeVisible({ timeout: 60000 });

// ✅ Instead, understand WHY timing fails
// ✅ Wait for the actual condition (network, state, element)
// ✅ Use network-first patterns
```

---

## Related Knowledge

- [Visual Debugging](visual-debugging.md) - Trace viewer for timing analysis
- [Network First](network-first.md) - API synchronization patterns
- [Test Healing Patterns](test-healing-patterns.md) - Auto-recovery from timing issues

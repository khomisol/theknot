# Test Healing Patterns

> **Purpose**: Strategies for building self-healing tests that automatically recover from common failure modes including selector changes, timing issues, and data inconsistencies.

---

## What is Test Healing?

Test healing refers to patterns that allow tests to:
- Automatically recover from transient failures
- Adapt to minor UI changes
- Provide meaningful diagnostics when healing fails
- Reduce maintenance burden without sacrificing reliability

---

## Selector Healing

### Fallback Selector Strategy

```typescript
// fixtures/healing-locators.fixture.ts
import { Locator, Page } from '@playwright/test';

export function healingLocator(
  page: Page,
  selectors: string[],
  description: string
): Locator {
  // Try selectors in priority order
  for (const selector of selectors) {
    const locator = page.locator(selector);
    // Return first matching selector
    return locator.first();
  }
  
  throw new Error(`No matching selector for: ${description}`);
}

// Usage
const submitButton = healingLocator(page, [
  '[data-testid="submit-button"]',      // Primary: test ID
  '[aria-label="Submit form"]',          // Fallback: ARIA
  'button:has-text("Submit")',           // Fallback: text
  'form button[type="submit"]',          // Last resort: structure
], 'Submit Button');
```

### Smart Locator Class

```typescript
class HealingLocator {
  private page: Page;
  private strategies: (() => Locator)[];
  private description: string;
  
  constructor(page: Page, description: string) {
    this.page = page;
    this.description = description;
    this.strategies = [];
  }
  
  byTestId(id: string) {
    this.strategies.push(() => this.page.getByTestId(id));
    return this;
  }
  
  byRole(role: string, options?: { name?: string }) {
    this.strategies.push(() => this.page.getByRole(role as any, options));
    return this;
  }
  
  byText(text: string) {
    this.strategies.push(() => this.page.getByText(text));
    return this;
  }
  
  bySelector(selector: string) {
    this.strategies.push(() => this.page.locator(selector));
    return this;
  }
  
  async locate(): Promise<Locator> {
    for (const strategy of this.strategies) {
      const locator = strategy();
      if (await locator.count() > 0) {
        return locator.first();
      }
    }
    throw new Error(`Cannot locate: ${this.description}`);
  }
}

// Usage
const button = await new HealingLocator(page, 'Login Button')
  .byTestId('login-btn')
  .byRole('button', { name: 'Log in' })
  .byText('Log in')
  .locate();
```

---

## Timing Healing

### Auto-Retry with Backoff

```typescript
async function withRetry<T>(
  action: () => Promise<T>,
  options: {
    maxAttempts?: number;
    backoffMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    backoffMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options;
  
  let lastError: Error;
  let delay = backoffMs;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
      delay *= backoffMultiplier;
    }
  }
  
  throw lastError!;
}

// Usage
await withRetry(async () => {
  await page.click('[data-testid="flaky-button"]');
  await expect(page.getByText('Success')).toBeVisible();
});
```

### Network-Aware Waiting

```typescript
async function waitForAppReady(page: Page) {
  // Wait for initial network activity to settle
  await page.waitForLoadState('networkidle');
  
  // Wait for any pending API calls
  const pendingRequests = new Set<string>();
  
  page.on('request', req => {
    if (req.url().includes('/api/')) {
      pendingRequests.add(req.url());
    }
  });
  
  page.on('response', resp => {
    pendingRequests.delete(resp.url());
  });
  
  // Wait until no pending API requests
  await expect.poll(() => pendingRequests.size, {
    timeout: 10000,
  }).toBe(0);
}
```

---

## Data Healing

### Dynamic Data Validation

```typescript
// Instead of hardcoded assertions
test('user profile displays correctly', async ({ page }) => {
  await page.goto('/profile');
  
  // ❌ Brittle: hardcoded value
  // await expect(page.getByTestId('name')).toHaveText('John Doe');
  
  // ✅ Healing: validate structure, not specific values
  const name = await page.getByTestId('name').textContent();
  expect(name).toBeTruthy();
  expect(name!.length).toBeGreaterThan(0);
  expect(name!.split(' ').length).toBeGreaterThanOrEqual(1);
});
```

### Test Data Recovery

```typescript
// fixtures/data-healing.fixture.ts
export const test = base.extend({
  ensureTestUser: async ({ request }, use) => {
    // Try to get existing user
    let user;
    try {
      const response = await request.get('/api/test-user/e2e-user-1');
      if (response.ok()) {
        user = await response.json();
      }
    } catch {}
    
    // Create if doesn't exist
    if (!user) {
      const response = await request.post('/api/test-users', {
        data: { username: 'e2e-user-1', email: 'e2e@test.com' },
      });
      user = await response.json();
    }
    
    await use(user);
  },
});
```

---

## State Healing

### Clean State Recovery

```typescript
// fixtures/state-healing.fixture.ts
export const test = base.extend({
  cleanPage: async ({ page, context }, use) => {
    // Before test: ensure clean state
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await use(page);
    
    // After test: reset for next test
    try {
      await page.goto('/logout', { timeout: 5000 });
    } catch {
      // Ignore logout failures during cleanup
    }
  },
});
```

### Session Recovery

```typescript
async function ensureAuthenticated(page: Page) {
  // Check if already authenticated
  const isLoggedIn = await page.evaluate(() => {
    return !!localStorage.getItem('authToken');
  });
  
  if (!isLoggedIn) {
    // Re-authenticate
    await page.goto('/login');
    await page.fill('[data-testid="email"]', process.env.TEST_EMAIL!);
    await page.fill('[data-testid="password"]', process.env.TEST_PASSWORD!);
    await page.click('[data-testid="login"]');
    await page.waitForURL('/dashboard');
  }
}
```

---

## Modal/Popup Healing

### Dismiss Unexpected Popups

```typescript
// fixtures/popup-healing.fixture.ts
export const test = base.extend({
  page: async ({ page }, use) => {
    // Auto-dismiss common popups
    page.on('dialog', async dialog => {
      console.log(`Auto-dismissing dialog: ${dialog.message()}`);
      await dialog.dismiss();
    });
    
    // Handle cookie consent
    await page.addInitScript(() => {
      localStorage.setItem('cookieConsent', 'accepted');
    });
    
    await use(page);
  },
});

// Or handle in test
async function dismissPopupsIfPresent(page: Page) {
  const popupSelectors = [
    '[data-testid="cookie-banner"] button:has-text("Accept")',
    '[data-testid="newsletter-popup"] button:has-text("Close")',
    '.modal-overlay .close-button',
  ];
  
  for (const selector of popupSelectors) {
    const popup = page.locator(selector);
    if (await popup.isVisible({ timeout: 1000 }).catch(() => false)) {
      await popup.click();
    }
  }
}
```

---

## Error Boundary Healing

### Graceful Error Recovery

```typescript
test('handles error gracefully', async ({ page }) => {
  let hasError = false;
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
    hasError = true;
  });
  
  await page.goto('/app');
  
  if (hasError) {
    // Attempt recovery
    await page.reload();
    hasError = false;
    
    // Continue test with fresh state
    await page.goto('/app');
  }
  
  // Proceed with assertions
  await expect(page.getByTestId('main-content')).toBeVisible();
});
```

---

## Healing Report Integration

### Track Healing Events

```typescript
class HealingTracker {
  private healingEvents: Array<{
    test: string;
    type: string;
    original: string;
    healed: string;
    timestamp: Date;
  }> = [];
  
  recordHealing(test: string, type: string, original: string, healed: string) {
    this.healingEvents.push({
      test,
      type,
      original,
      healed,
      timestamp: new Date(),
    });
  }
  
  getReport() {
    return {
      totalHealings: this.healingEvents.length,
      byType: this.groupBy(this.healingEvents, 'type'),
      events: this.healingEvents,
    };
  }
  
  private groupBy<T>(array: T[], key: keyof T) {
    return array.reduce((acc, item) => {
      const k = String(item[key]);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Usage in fixtures
const healingTracker = new HealingTracker();

test.afterAll(async () => {
  const report = healingTracker.getReport();
  if (report.totalHealings > 0) {
    console.log('Healing Report:', JSON.stringify(report, null, 2));
  }
});
```

---

## When NOT to Heal

### Legitimate Failures

```typescript
// Don't heal away real bugs!
// Healing should only handle:
// ✅ Transient timing issues
// ✅ Minor selector changes
// ✅ Test environment flakiness

// Should NOT heal:
// ❌ Actual functionality bugs
// ❌ Missing features
// ❌ Security/authentication failures
// ❌ Data corruption issues
```

### Healing Limits

```typescript
const MAX_HEALING_ATTEMPTS = 3;
const HEALING_THRESHOLD = 0.2;  // Max 20% tests can heal

// If too many tests need healing, investigation required
test.afterAll(async () => {
  const healingRate = healedTests / totalTests;
  if (healingRate > HEALING_THRESHOLD) {
    console.warn(`High healing rate: ${healingRate * 100}%`);
    console.warn('Investigation required - possible systematic issue');
  }
});
```

---

## Best Practices

| Practice | Benefit |
|----------|---------|
| Prioritize test IDs | Stable selectors reduce healing needs |
| Log healing events | Track patterns for permanent fixes |
| Set healing limits | Prevent masking real issues |
| Review healing reports | Identify systematic problems |
| Update tests, not just heal | Permanent fixes over workarounds |

---

## Related Knowledge

- [Selector Resilience](selector-resilience.md) - Building stable selectors
- [Timing Debugging](timing-debugging.md) - Fixing timing issues
- [Visual Debugging](visual-debugging.md) - Investigating failures

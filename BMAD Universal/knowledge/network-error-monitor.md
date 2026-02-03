# Network Error Monitor

> **Purpose**: Automatic detection and reporting of HTTP 4xx/5xx errors during test execution to catch unexpected API failures.

---

## Why Monitor Network Errors?

- **Catch hidden failures** - UI may not show all backend errors
- **Early detection** - Find issues before they cascade
- **Debug context** - Know which API calls failed
- **Quality gate** - Fail tests on unexpected errors

---

## Basic Network Monitor

### Setup Pattern

```typescript
// fixtures/network-monitor.fixture.ts
import { test as base, Page, Response } from '@playwright/test';

interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  timestamp: number;
}

export const test = base.extend<{ networkErrors: NetworkError[] }>({
  networkErrors: async ({ page }, use) => {
    const errors: NetworkError[] = [];
    
    page.on('response', (response: Response) => {
      const status = response.status();
      
      if (status >= 400) {
        errors.push({
          url: response.url(),
          method: response.request().method(),
          status,
          statusText: response.statusText(),
          timestamp: Date.now(),
        });
      }
    });
    
    await use(errors);
  },
});

// Usage
test('page loads without API errors', async ({ page, networkErrors }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="load-data"]');
  
  // Assert no unexpected errors
  expect(networkErrors).toHaveLength(0);
});
```

---

## Configurable Monitor

### Allow Expected Errors

```typescript
interface MonitorConfig {
  ignoreUrls?: (string | RegExp)[];
  ignoreStatuses?: number[];
  apiOnly?: boolean;
}

function createNetworkMonitor(page: Page, config: MonitorConfig = {}) {
  const errors: NetworkError[] = [];
  const { ignoreUrls = [], ignoreStatuses = [], apiOnly = false } = config;
  
  page.on('response', (response) => {
    const url = response.url();
    const status = response.status();
    
    // Skip non-API if apiOnly
    if (apiOnly && !url.includes('/api/')) return;
    
    // Skip ignored URLs
    if (ignoreUrls.some(pattern => 
      typeof pattern === 'string' 
        ? url.includes(pattern)
        : pattern.test(url)
    )) return;
    
    // Skip ignored statuses
    if (ignoreStatuses.includes(status)) return;
    
    if (status >= 400) {
      errors.push({
        url,
        method: response.request().method(),
        status,
        statusText: response.statusText(),
        timestamp: Date.now(),
      });
    }
  });
  
  return {
    getErrors: () => errors,
    hasErrors: () => errors.length > 0,
    clear: () => errors.length = 0,
  };
}

// Usage
test('handles expected 404s', async ({ page }) => {
  const monitor = createNetworkMonitor(page, {
    ignoreUrls: ['/api/optional-feature'],
    ignoreStatuses: [404],  // 404s are expected
  });
  
  await page.goto('/app');
  
  // Only fails on unexpected errors (not 404s)
  expect(monitor.getErrors()).toHaveLength(0);
});
```

---

## Auto-Failing Test Fixture

### Fail on Any Error

```typescript
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const errors: NetworkError[] = [];
    
    page.on('response', (response) => {
      if (response.status() >= 400) {
        errors.push({
          url: response.url(),
          method: response.request().method(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: Date.now(),
        });
      }
    });
    
    await use(page);
    
    // Auto-fail if errors detected
    if (errors.length > 0) {
      await testInfo.attach('network-errors', {
        body: JSON.stringify(errors, null, 2),
        contentType: 'application/json',
      });
      
      throw new Error(
        `Test failed due to ${errors.length} network error(s):\n` +
        errors.map(e => `  ${e.status} ${e.method} ${e.url}`).join('\n')
      );
    }
  },
});
```

### With Opt-Out

```typescript
// Mark test to allow errors
test('handles errors gracefully', async ({ page }) => {
  test.info().annotations.push({ type: 'allowNetworkErrors', description: '' });
  
  await page.goto('/error-page');
  // Network errors won't fail this test
});

// In fixture
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const errors: NetworkError[] = [];
    
    // ... monitor setup ...
    
    await use(page);
    
    // Check for opt-out
    const allowErrors = testInfo.annotations.some(
      a => a.type === 'allowNetworkErrors'
    );
    
    if (!allowErrors && errors.length > 0) {
      throw new Error(`Network errors detected: ${errors.length}`);
    }
  },
});
```

---

## Detailed Error Capture

### Capture Response Bodies

```typescript
interface DetailedNetworkError extends NetworkError {
  requestBody?: string;
  responseBody?: string;
  headers?: Record<string, string>;
}

async function captureDetailedError(response: Response): Promise<DetailedNetworkError> {
  const error: DetailedNetworkError = {
    url: response.url(),
    method: response.request().method(),
    status: response.status(),
    statusText: response.statusText(),
    timestamp: Date.now(),
    requestBody: response.request().postData() || undefined,
  };
  
  // Capture response body (may fail for binary responses)
  try {
    error.responseBody = await response.text();
  } catch {
    error.responseBody = '[Unable to read response body]';
  }
  
  // Capture headers
  error.headers = response.headers();
  
  return error;
}

// In fixture
page.on('response', async (response) => {
  if (response.status() >= 400) {
    const error = await captureDetailedError(response);
    errors.push(error);
  }
});
```

---

## Error Categorization

### Separate Client vs Server Errors

```typescript
interface CategorizedErrors {
  clientErrors: NetworkError[];  // 4xx
  serverErrors: NetworkError[];  // 5xx
}

function categorizeErrors(errors: NetworkError[]): CategorizedErrors {
  return {
    clientErrors: errors.filter(e => e.status >= 400 && e.status < 500),
    serverErrors: errors.filter(e => e.status >= 500),
  };
}

test('no server errors', async ({ page, networkErrors }) => {
  await page.goto('/app');
  await page.click('[data-testid="action"]');
  
  const { serverErrors, clientErrors } = categorizeErrors(networkErrors);
  
  // 4xx might be acceptable, but 5xx should never happen
  expect(serverErrors).toHaveLength(0);
  
  // Log client errors for awareness
  if (clientErrors.length > 0) {
    console.log('Client errors:', clientErrors);
  }
});
```

---

## Report Integration

### Attach Error Summary

```typescript
test.afterEach(async ({ networkErrors }, testInfo) => {
  if (networkErrors && networkErrors.length > 0) {
    // Group by status code
    const byStatus = networkErrors.reduce((acc, err) => {
      acc[err.status] = acc[err.status] || [];
      acc[err.status].push(err);
      return acc;
    }, {} as Record<number, NetworkError[]>);
    
    const summary = {
      totalErrors: networkErrors.length,
      byStatus,
      urls: networkErrors.map(e => `${e.method} ${e.url}`),
    };
    
    await testInfo.attach('network-error-summary', {
      body: JSON.stringify(summary, null, 2),
      contentType: 'application/json',
    });
  }
});
```

---

## Continuous Monitoring

### Monitor Across Multiple Pages

```typescript
export const test = base.extend({
  errorMonitor: async ({ context }, use, testInfo) => {
    const allErrors: NetworkError[] = [];
    
    // Monitor all pages in context
    context.on('page', (page) => {
      page.on('response', (response) => {
        if (response.status() >= 400) {
          allErrors.push({
            url: response.url(),
            method: response.request().method(),
            status: response.status(),
            statusText: response.statusText(),
            timestamp: Date.now(),
          });
        }
      });
    });
    
    await use({
      getErrors: () => allErrors,
      clear: () => allErrors.length = 0,
    });
    
    if (allErrors.length > 0) {
      await testInfo.attach('all-network-errors', {
        body: JSON.stringify(allErrors, null, 2),
        contentType: 'application/json',
      });
    }
  },
});
```

---

## Filtering Patterns

### Common Filter Configurations

```typescript
// Development/test noise
const devFilters = {
  ignoreUrls: [
    '/api/health',
    '/api/metrics',
    '/__webpack_hmr',
    '/sockjs-node',
  ],
};

// Expected failures
const expectedFailures = {
  ignoreUrls: [
    /\/api\/feature-flag/,  // Feature flags return 404 when disabled
  ],
  ignoreStatuses: [304],  // Not modified is fine
};

// Strict mode - catch everything
const strictMode = {
  ignoreUrls: [],
  ignoreStatuses: [],
  apiOnly: false,
};
```

---

## Usage Examples

### Full Integration Test

```typescript
test('complete purchase flow has no errors', async ({ page, networkErrors }) => {
  // Add to cart
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  
  // Checkout
  await page.goto('/checkout');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.click('[data-testid="pay"]');
  
  // Confirm
  await expect(page.getByText('Order confirmed')).toBeVisible();
  
  // Verify no API errors throughout flow
  expect(networkErrors).toHaveLength(0);
});
```

### With Expected Errors

```typescript
test('handles payment failure gracefully', async ({ page }) => {
  // This test expects a 402 error
  const monitor = createNetworkMonitor(page, {
    ignoreStatuses: [402],  // Payment required
  });
  
  await page.goto('/checkout');
  await page.fill('[data-testid="card"]', '4000000000000002');  // Decline card
  await page.click('[data-testid="pay"]');
  
  // Should show user-friendly error
  await expect(page.getByText('Payment declined')).toBeVisible();
  
  // No unexpected errors
  expect(monitor.getErrors()).toHaveLength(0);
});
```

---

## Related Knowledge

- [Error Handling](error-handling.md) - Testing error scenarios
- [Network First](network-first.md) - Network patterns
- [Visual Debugging](visual-debugging.md) - Debugging artifacts

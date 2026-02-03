# Logging Utilities

> **Purpose**: Structured logging patterns for test debugging, integrating with Playwright reports, and capturing diagnostic information.

---

## Why Structured Logging?

- **Debugging** - Understand test execution flow
- **Diagnostics** - Capture app state at failure points
- **Reports** - Enrich HTML reports with context
- **Monitoring** - Track test health over time

---

## Basic Logging Patterns

### Console Logging with Context

```typescript
function log(context: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${context}] ${message}`;
  
  if (data) {
    console.log(logEntry, JSON.stringify(data, null, 2));
  } else {
    console.log(logEntry);
  }
}

test('checkout flow', async ({ page }) => {
  log('checkout', 'Starting checkout test');
  
  await page.goto('/cart');
  log('checkout', 'Navigated to cart');
  
  await page.click('[data-testid="checkout"]');
  log('checkout', 'Clicked checkout button');
  
  // ...
});
```

### Structured Logger Class

```typescript
class TestLogger {
  private context: string;
  private entries: LogEntry[] = [];
  
  constructor(context: string) {
    this.context = context;
  }
  
  info(message: string, data?: Record<string, any>) {
    this.log('INFO', message, data);
  }
  
  warn(message: string, data?: Record<string, any>) {
    this.log('WARN', message, data);
  }
  
  error(message: string, data?: Record<string, any>) {
    this.log('ERROR', message, data);
  }
  
  private log(level: string, message: string, data?: Record<string, any>) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
    };
    
    this.entries.push(entry);
    console.log(`[${entry.timestamp}] [${level}] [${this.context}] ${message}`);
    if (data) console.log(data);
  }
  
  getEntries() {
    return this.entries;
  }
  
  toJSON() {
    return JSON.stringify(this.entries, null, 2);
  }
}
```

---

## Playwright Report Integration

### Attaching Logs to Test

```typescript
test('with logging', async ({ page }) => {
  const logger = new TestLogger('checkout');
  
  logger.info('Starting test');
  await page.goto('/checkout');
  logger.info('Page loaded');
  
  try {
    await page.click('[data-testid="pay"]');
    logger.info('Payment initiated');
  } catch (error) {
    logger.error('Payment failed', { error: String(error) });
    throw error;
  } finally {
    // Attach logs to report
    await test.info().attach('test-logs', {
      body: logger.toJSON(),
      contentType: 'application/json',
    });
  }
});
```

### Auto-Logging Fixture

```typescript
// fixtures/logging.fixture.ts
import { test as base } from '@playwright/test';

type LogFixtures = {
  logger: TestLogger;
};

export const test = base.extend<LogFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new TestLogger(testInfo.title);
    
    logger.info('Test starting');
    
    await use(logger);
    
    logger.info('Test completed', { 
      status: testInfo.status,
      duration: testInfo.duration,
    });
    
    // Auto-attach logs
    await testInfo.attach('test-logs', {
      body: logger.toJSON(),
      contentType: 'application/json',
    });
  },
});

// Usage
test('checkout flow', async ({ page, logger }) => {
  logger.info('Navigating to cart');
  await page.goto('/cart');
  
  logger.info('Initiating checkout');
  await page.click('[data-testid="checkout"]');
});
```

---

## Network Request Logging

### Capturing All Requests

```typescript
test('with network logging', async ({ page }) => {
  const requests: { url: string; method: string; status?: number }[] = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
    });
  });
  
  page.on('response', response => {
    const req = requests.find(r => r.url === response.url());
    if (req) req.status = response.status();
  });
  
  await page.goto('/app');
  
  // Attach network log
  await test.info().attach('network-requests', {
    body: JSON.stringify(requests, null, 2),
    contentType: 'application/json',
  });
});
```

### API-Only Logging

```typescript
// fixtures/api-logger.fixture.ts
export const test = base.extend({
  apiLogger: async ({ page }, use, testInfo) => {
    const apiCalls: ApiLogEntry[] = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          timestamp: Date.now(),
          method: request.method(),
          url: request.url(),
          body: request.postData(),
        });
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        const call = apiCalls.find(c => c.url === response.url());
        if (call) {
          call.status = response.status();
          try {
            call.response = await response.json();
          } catch {
            call.response = await response.text();
          }
        }
      }
    });
    
    await use({ getCalls: () => apiCalls });
    
    await testInfo.attach('api-calls', {
      body: JSON.stringify(apiCalls, null, 2),
      contentType: 'application/json',
    });
  },
});
```

---

## Console Log Capture

### Capturing Browser Console

```typescript
test('captures console logs', async ({ page }) => {
  const consoleLogs: { type: string; text: string }[] = [];
  
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });
  
  await page.goto('/app');
  await page.click('[data-testid="action"]');
  
  // Filter by type
  const errors = consoleLogs.filter(l => l.type === 'error');
  const warnings = consoleLogs.filter(l => l.type === 'warning');
  
  await test.info().attach('console-logs', {
    body: JSON.stringify({ errors, warnings, all: consoleLogs }, null, 2),
    contentType: 'application/json',
  });
});
```

---

## Step Logging

### Using Playwright Steps

```typescript
test('checkout with steps', async ({ page }) => {
  await test.step('Navigate to cart', async () => {
    await page.goto('/cart');
    await expect(page.getByTestId('cart')).toBeVisible();
  });
  
  await test.step('Fill shipping info', async () => {
    await page.fill('[data-testid="address"]', '123 Main St');
    await page.fill('[data-testid="city"]', 'Springfield');
  });
  
  await test.step('Complete payment', async () => {
    await page.fill('[data-testid="card"]', '4242424242424242');
    await page.click('[data-testid="pay"]');
  });
  
  await test.step('Verify confirmation', async () => {
    await expect(page.getByText('Order confirmed')).toBeVisible();
  });
});
```

### Custom Step Wrapper

```typescript
async function step<T>(
  name: string, 
  action: () => Promise<T>,
  logger?: TestLogger
): Promise<T> {
  logger?.info(`Step: ${name} - Starting`);
  
  const result = await test.step(name, action);
  
  logger?.info(`Step: ${name} - Completed`);
  return result;
}

test('with step logging', async ({ page, logger }) => {
  await step('Load cart', async () => {
    await page.goto('/cart');
  }, logger);
  
  await step('Checkout', async () => {
    await page.click('[data-testid="checkout"]');
  }, logger);
});
```

---

## Performance Logging

### Timing Operations

```typescript
class PerformanceLogger {
  private timings: { name: string; duration: number }[] = [];
  private starts: Map<string, number> = new Map();
  
  start(name: string) {
    this.starts.set(name, Date.now());
  }
  
  end(name: string) {
    const start = this.starts.get(name);
    if (start) {
      this.timings.push({
        name,
        duration: Date.now() - start,
      });
      this.starts.delete(name);
    }
  }
  
  async measure<T>(name: string, action: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await action();
    this.end(name);
    return result;
  }
  
  getReport() {
    return {
      timings: this.timings,
      total: this.timings.reduce((sum, t) => sum + t.duration, 0),
    };
  }
}

test('performance measured', async ({ page }) => {
  const perf = new PerformanceLogger();
  
  await perf.measure('page-load', () => page.goto('/app'));
  await perf.measure('search', () => page.fill('[data-testid="search"]', 'query'));
  await perf.measure('results', () => page.waitForSelector('[data-testid="results"]'));
  
  await test.info().attach('performance', {
    body: JSON.stringify(perf.getReport(), null, 2),
    contentType: 'application/json',
  });
});
```

---

## Error Context Logging

### Capturing State on Failure

```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    // Capture page state
    const pageState = {
      url: page.url(),
      title: await page.title(),
      localStorage: await page.evaluate(() => JSON.stringify(localStorage)),
      cookies: await page.context().cookies(),
    };
    
    await testInfo.attach('page-state-on-failure', {
      body: JSON.stringify(pageState, null, 2),
      contentType: 'application/json',
    });
    
    // Capture HTML
    await testInfo.attach('page-html', {
      body: await page.content(),
      contentType: 'text/html',
    });
  }
});
```

---

## Log Levels and Filtering

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class FilterableLogger {
  private minLevel: LogLevel;
  
  constructor(minLevel: LogLevel = 'info') {
    this.minLevel = minLevel;
  }
  
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel];
  }
  
  debug(msg: string) {
    if (this.shouldLog('debug')) console.log(`[DEBUG] ${msg}`);
  }
  
  info(msg: string) {
    if (this.shouldLog('info')) console.log(`[INFO] ${msg}`);
  }
  
  warn(msg: string) {
    if (this.shouldLog('warn')) console.warn(`[WARN] ${msg}`);
  }
  
  error(msg: string) {
    if (this.shouldLog('error')) console.error(`[ERROR] ${msg}`);
  }
}

// Configure via env
const logger = new FilterableLogger(
  (process.env.LOG_LEVEL as LogLevel) || 'info'
);
```

---

## Related Knowledge

- [Visual Debugging](visual-debugging.md) - Debugging artifacts
- [Error Handling](error-handling.md) - Error capture patterns

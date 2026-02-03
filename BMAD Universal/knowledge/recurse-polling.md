# Polling Utilities (Recurse Pattern)

> **Purpose**: Patterns for polling and waiting on async operations that require multiple attempts or time-based checks.

---

## When to Use Polling

- Waiting for backend processing to complete
- Checking external service status
- Monitoring job queues
- Waiting for data consistency after writes
- Checking email/notification delivery

---

## Basic Polling Pattern

### Simple Poll Until

```typescript
async function pollUntil<T>(
  action: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: {
    timeout?: number;
    interval?: number;
    description?: string;
  } = {}
): Promise<T> {
  const { timeout = 30000, interval = 1000, description = 'condition' } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await action();
    
    if (predicate(result)) {
      return result;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Polling timeout: ${description} not met within ${timeout}ms`);
}

// Usage
test('order processing completes', async ({ request }) => {
  // Create order
  const order = await request.post('/api/orders', { data: { items: [1, 2] } });
  const { id } = await order.json();
  
  // Poll until processed
  const result = await pollUntil(
    async () => {
      const response = await request.get(`/api/orders/${id}`);
      return response.json();
    },
    (order) => order.status === 'completed',
    { timeout: 60000, description: 'order completion' }
  );
  
  expect(result.status).toBe('completed');
});
```

---

## Advanced Polling with Backoff

### Exponential Backoff

```typescript
interface BackoffOptions {
  initialInterval?: number;
  maxInterval?: number;
  multiplier?: number;
  timeout?: number;
}

async function pollWithBackoff<T>(
  action: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: BackoffOptions = {}
): Promise<T> {
  const {
    initialInterval = 500,
    maxInterval = 10000,
    multiplier = 2,
    timeout = 60000,
  } = options;
  
  const startTime = Date.now();
  let interval = initialInterval;
  let attempts = 0;
  
  while (Date.now() - startTime < timeout) {
    attempts++;
    const result = await action();
    
    if (predicate(result)) {
      console.log(`Poll succeeded after ${attempts} attempts`);
      return result;
    }
    
    console.log(`Attempt ${attempts} failed, waiting ${interval}ms`);
    await new Promise(resolve => setTimeout(resolve, interval));
    
    interval = Math.min(interval * multiplier, maxInterval);
  }
  
  throw new Error(`Polling timeout after ${attempts} attempts`);
}

// Usage - good for rate-limited APIs
const result = await pollWithBackoff(
  () => api.checkJobStatus(jobId),
  (status) => status === 'complete',
  { initialInterval: 1000, maxInterval: 30000, timeout: 300000 }
);
```

---

## Playwright's Built-in Polling

### Using expect.poll

```typescript
test('status updates to complete', async ({ page }) => {
  await page.goto('/job/123');
  
  // Built-in polling
  await expect.poll(async () => {
    return page.getByTestId('status').textContent();
  }, {
    timeout: 60000,
    intervals: [1000, 2000, 5000, 10000],
  }).toBe('Complete');
});

// Polling API responses
test('API eventually returns data', async ({ request }) => {
  await expect.poll(async () => {
    const response = await request.get('/api/report/123');
    const data = await response.json();
    return data.status;
  }, {
    message: 'Report should be ready',
    timeout: 120000,
  }).toBe('ready');
});
```

### Polling with Custom Intervals

```typescript
test('job completes with backoff', async ({ request }) => {
  // Custom interval pattern: frequent at first, then slower
  await expect.poll(async () => {
    const response = await request.get('/api/jobs/123');
    return (await response.json()).status;
  }, {
    intervals: [500, 1000, 2000, 5000, 10000, 30000],
    timeout: 300000,
  }).toBe('completed');
});
```

---

## Polling Fixtures

### Reusable Polling Helper

```typescript
// fixtures/polling.fixture.ts
import { test as base } from '@playwright/test';

type PollingFixtures = {
  poll: <T>(
    action: () => Promise<T>,
    predicate: (result: T) => boolean,
    options?: { timeout?: number; interval?: number }
  ) => Promise<T>;
};

export const test = base.extend<PollingFixtures>({
  poll: async ({}, use) => {
    const poll = async <T>(
      action: () => Promise<T>,
      predicate: (result: T) => boolean,
      options: { timeout?: number; interval?: number } = {}
    ): Promise<T> => {
      const { timeout = 30000, interval = 1000 } = options;
      const start = Date.now();
      
      while (Date.now() - start < timeout) {
        const result = await action();
        if (predicate(result)) return result;
        await new Promise(r => setTimeout(r, interval));
      }
      
      throw new Error('Polling timeout');
    };
    
    await use(poll);
  },
});

// Usage
test('with poll fixture', async ({ poll, request }) => {
  await request.post('/api/jobs', { data: { type: 'export' } });
  
  const job = await poll(
    async () => (await request.get('/api/jobs/latest')).json(),
    (j) => j.status === 'done',
    { timeout: 60000 }
  );
  
  expect(job.result).toBeDefined();
});
```

---

## Specific Use Cases

### Waiting for Email

```typescript
async function waitForEmail(mailbox: string, subject: string) {
  return pollUntil(
    async () => {
      const response = await fetch(`/api/mail/${mailbox}`);
      const emails = await response.json();
      return emails.find((e: any) => e.subject.includes(subject));
    },
    (email) => email !== undefined,
    { timeout: 60000, description: `email with subject "${subject}"` }
  );
}

test('password reset email received', async ({ page }) => {
  await page.goto('/forgot-password');
  await page.fill('[data-testid="email"]', 'user@mailbox.com');
  await page.click('[data-testid="submit"]');
  
  const email = await waitForEmail('user@mailbox.com', 'Reset your password');
  expect(email).toBeDefined();
});
```

### Waiting for Database State

```typescript
async function waitForDbRecord(id: string, expectedState: string) {
  return pollUntil(
    async () => {
      const response = await fetch(`/api/records/${id}`);
      return response.json();
    },
    (record) => record.state === expectedState,
    { timeout: 30000, interval: 500 }
  );
}

test('record transitions to approved', async ({ request }) => {
  const { id } = await (await request.post('/api/records')).json();
  
  await request.post(`/api/records/${id}/approve`);
  
  const record = await waitForDbRecord(id, 'approved');
  expect(record.state).toBe('approved');
});
```

### Waiting for File Processing

```typescript
async function waitForFileProcessed(fileId: string) {
  return pollUntil(
    async () => {
      const response = await fetch(`/api/files/${fileId}/status`);
      return response.json();
    },
    (status) => ['completed', 'failed'].includes(status.state),
    { timeout: 300000, interval: 5000, description: 'file processing' }
  );
}

test('uploaded file is processed', async ({ page }) => {
  await page.setInputFiles('[data-testid="upload"]', './large-file.csv');
  await page.click('[data-testid="submit"]');
  
  const fileId = await page.getByTestId('file-id').textContent();
  
  const status = await waitForFileProcessed(fileId!);
  expect(status.state).toBe('completed');
});
```

---

## Error Handling in Polling

### Retry on Specific Errors

```typescript
async function pollWithRetry<T>(
  action: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: {
    timeout?: number;
    interval?: number;
    retryOnError?: boolean;
  } = {}
): Promise<T> {
  const { timeout = 30000, interval = 1000, retryOnError = true } = options;
  const startTime = Date.now();
  let lastError: Error | null = null;
  
  while (Date.now() - startTime < timeout) {
    try {
      const result = await action();
      
      if (predicate(result)) {
        return result;
      }
    } catch (error) {
      if (!retryOnError) throw error;
      lastError = error as Error;
      console.log(`Poll action failed: ${lastError.message}, retrying...`);
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  if (lastError) {
    throw new Error(`Polling failed with error: ${lastError.message}`);
  }
  
  throw new Error('Polling timeout');
}
```

### Conditional Failure

```typescript
async function pollUntilOrFail<T>(
  action: () => Promise<T>,
  successPredicate: (result: T) => boolean,
  failurePredicate: (result: T) => boolean,
  options: { timeout?: number; interval?: number } = {}
): Promise<T> {
  const { timeout = 30000, interval = 1000 } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await action();
    
    if (failurePredicate(result)) {
      throw new Error('Failure condition met');
    }
    
    if (successPredicate(result)) {
      return result;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Polling timeout');
}

// Usage - fail fast if job errors
const job = await pollUntilOrFail(
  () => api.getJobStatus(jobId),
  (job) => job.status === 'completed',
  (job) => job.status === 'failed',  // Fail immediately if job failed
  { timeout: 60000 }
);
```

---

## Anti-Patterns

```typescript
// ❌ Fixed wait instead of polling
await page.waitForTimeout(5000);  // Arbitrary wait

// ❌ Tight loop without delay
while (true) {
  if (await checkCondition()) break;
  // No delay - hammers the server
}

// ❌ Infinite polling
while (true) {
  // No timeout - runs forever if condition never met
}

// ✅ Proper polling
await pollUntil(
  checkCondition,
  (result) => result === true,
  { timeout: 30000, interval: 1000 }
);
```

---

## Related Knowledge

- [Timing Debugging](timing-debugging.md) - Timing patterns
- [Network First](network-first.md) - API synchronization

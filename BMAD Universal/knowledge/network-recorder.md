# Network Recording (HAR Files)

> **Purpose**: Patterns for recording network traffic as HAR files and replaying them for deterministic, offline testing.

---

## What are HAR Files?

HTTP Archive (HAR) files capture:
- All HTTP requests and responses
- Headers, cookies, and timing data
- Request/response bodies
- Network performance metrics

**Use Cases**:
- Deterministic API responses
- Offline test execution
- Performance baseline comparison
- Debugging network issues

---

## Recording HAR Files

### Basic Recording

```typescript
test('record network traffic', async ({ page, context }) => {
  // Start recording
  await context.routeFromHAR('network.har', {
    update: true,  // Create/update HAR file
  });
  
  await page.goto('/dashboard');
  await page.click('[data-testid="load-data"]');
  await page.click('[data-testid="submit"]');
  
  // HAR file is automatically saved
});
```

### Selective Recording

```typescript
test('record API calls only', async ({ page, context }) => {
  await context.routeFromHAR('api-calls.har', {
    update: true,
    url: '**/api/**',  // Only record API calls
  });
  
  await page.goto('/app');
});
```

### Recording Script

```typescript
// scripts/record-har.ts
import { chromium } from '@playwright/test';

async function recordHAR() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // Enable HAR recording
  await context.routeFromHAR('./recordings/session.har', {
    update: true,
    updateContent: 'embed',  // Embed response bodies
  });
  
  const page = await context.newPage();
  
  console.log('Navigate and interact with the app...');
  console.log('Press Ctrl+C when done.');
  
  await page.goto('http://localhost:3000');
  
  // Keep browser open for manual interaction
  await page.waitForTimeout(300000);  // 5 minutes
  
  await browser.close();
}

recordHAR();
```

---

## Replaying HAR Files

### Basic Replay

```typescript
test('uses recorded API responses', async ({ page, context }) => {
  // Replay from HAR (don't update)
  await context.routeFromHAR('api-calls.har', {
    update: false,
  });
  
  await page.goto('/dashboard');
  
  // API calls are served from HAR file
  await expect(page.getByText('Dashboard loaded')).toBeVisible();
});
```

### Selective Replay

```typescript
test('mock specific endpoints', async ({ page, context }) => {
  await context.routeFromHAR('user-api.har', {
    url: '**/api/users/**',
    update: false,
  });
  
  // User API from HAR, other APIs hit real server
  await page.goto('/profile');
});
```

### Fallback to Network

```typescript
test('HAR with network fallback', async ({ page, context }) => {
  await context.routeFromHAR('cached-api.har', {
    update: false,
    notFound: 'fallback',  // If not in HAR, make real request
  });
  
  await page.goto('/app');
});
```

---

## HAR File Management

### Organized Recording Structure

```
fixtures/
  har/
    auth/
      login.har
      logout.har
    checkout/
      payment.har
      cart.har
    common/
      user-profile.har
```

### Environment-Specific HAR

```typescript
const env = process.env.TEST_ENV || 'local';
const harPath = `./fixtures/har/${env}/api.har`;

test('with environment HAR', async ({ page, context }) => {
  await context.routeFromHAR(harPath, { update: false });
  await page.goto('/app');
});
```

### HAR Fixture

```typescript
// fixtures/har.fixture.ts
import { test as base } from '@playwright/test';
import * as path from 'path';

type HARFixtures = {
  useHAR: (name: string, options?: { url?: string }) => Promise<void>;
};

export const test = base.extend<HARFixtures>({
  useHAR: async ({ context }, use) => {
    const loadHAR = async (name: string, options: { url?: string } = {}) => {
      const harPath = path.join('./fixtures/har', `${name}.har`);
      await context.routeFromHAR(harPath, {
        update: false,
        url: options.url,
      });
    };
    
    await use(loadHAR);
  },
});

// Usage
test('with HAR fixture', async ({ page, useHAR }) => {
  await useHAR('checkout/payment');
  await page.goto('/checkout');
});
```

---

## Content Handling

### Embedding Content

```typescript
await context.routeFromHAR('full-content.har', {
  update: true,
  updateContent: 'embed',  // Include response bodies in HAR
});
```

### External Content

```typescript
await context.routeFromHAR('refs-only.har', {
  update: true,
  updateContent: 'attach',  // Store bodies as separate files
});

// Creates:
// refs-only.har
// refs-only.har_files/
//   response-1.json
//   response-2.html
```

---

## Dynamic Response Modification

### Combine HAR with Route Handlers

```typescript
test('HAR with custom overrides', async ({ page, context }) => {
  // Load base responses from HAR
  await context.routeFromHAR('base-api.har', { update: false });
  
  // Override specific endpoint
  await context.route('**/api/feature-flags', async (route) => {
    await route.fulfill({
      json: { newFeature: true },  // Custom response
    });
  });
  
  await page.goto('/app');
});
```

### Modify HAR Responses

```typescript
import * as fs from 'fs';

function modifyHAR(harPath: string, modifier: (har: any) => any) {
  const har = JSON.parse(fs.readFileSync(harPath, 'utf-8'));
  const modified = modifier(har);
  fs.writeFileSync(harPath, JSON.stringify(modified, null, 2));
}

// Update timestamps in HAR
modifyHAR('./api.har', (har) => {
  for (const entry of har.log.entries) {
    if (entry.response.content.text) {
      const body = JSON.parse(entry.response.content.text);
      if (body.timestamp) {
        body.timestamp = new Date().toISOString();
        entry.response.content.text = JSON.stringify(body);
      }
    }
  }
  return har;
});
```

---

## HAR for Performance Testing

### Capture Timing Data

```typescript
import * as fs from 'fs';

test('analyze network performance', async ({ page, context }) => {
  const harPath = './performance.har';
  
  await context.routeFromHAR(harPath, { update: true });
  await page.goto('/dashboard');
  
  // Read and analyze HAR
  const har = JSON.parse(fs.readFileSync(harPath, 'utf-8'));
  
  const slowRequests = har.log.entries.filter(
    (entry: any) => entry.time > 1000  // > 1 second
  );
  
  console.log('Slow requests:', slowRequests.length);
  
  expect(slowRequests.length).toBeLessThan(5);
});
```

### Compare Against Baseline

```typescript
function compareHARTiming(baseline: string, current: string) {
  const baseHAR = JSON.parse(fs.readFileSync(baseline, 'utf-8'));
  const currHAR = JSON.parse(fs.readFileSync(current, 'utf-8'));
  
  const comparison: any[] = [];
  
  for (const baseEntry of baseHAR.log.entries) {
    const currEntry = currHAR.log.entries.find(
      (e: any) => e.request.url === baseEntry.request.url
    );
    
    if (currEntry) {
      const diff = currEntry.time - baseEntry.time;
      comparison.push({
        url: baseEntry.request.url,
        baseline: baseEntry.time,
        current: currEntry.time,
        diff,
        regression: diff > baseEntry.time * 0.2,  // 20% slower
      });
    }
  }
  
  return comparison;
}
```

---

## CI Integration

### Generate HAR in CI

```yaml
# .github/workflows/record-har.yml
name: Update HAR Files
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  record:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start app
        run: npm run start:test &
        
      - name: Record HAR files
        run: npx playwright test --project=record-har
        
      - name: Commit HAR files
        run: |
          git add fixtures/har/
          git commit -m "Update HAR recordings" || exit 0
          git push
```

### Verify HAR Currency

```typescript
test('HAR is not stale', async () => {
  const harPath = './fixtures/har/api.har';
  const stats = fs.statSync(harPath);
  const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
  
  // Warn if HAR is older than 7 days
  if (ageInDays > 7) {
    console.warn(`HAR file is ${ageInDays.toFixed(1)} days old`);
  }
  
  expect(ageInDays).toBeLessThan(30);  // Fail if > 30 days
});
```

---

## Best Practices

### Do's

- ✅ Use HAR for stable, deterministic tests
- ✅ Organize HAR files by feature/scenario
- ✅ Update HAR files regularly
- ✅ Version control HAR files
- ✅ Use selective URL matching

### Don'ts

- ❌ Don't use stale HAR files (update periodically)
- ❌ Don't record sensitive data (tokens, PII)
- ❌ Don't rely on HAR for all tests (some need real API)
- ❌ Don't commit large binary responses

---

## Security Considerations

### Sanitize Sensitive Data

```typescript
function sanitizeHAR(harPath: string) {
  const har = JSON.parse(fs.readFileSync(harPath, 'utf-8'));
  
  for (const entry of har.log.entries) {
    // Remove auth headers
    entry.request.headers = entry.request.headers.filter(
      (h: any) => !['authorization', 'cookie', 'x-api-key'].includes(h.name.toLowerCase())
    );
    
    // Remove sensitive response data
    if (entry.response.content.text) {
      const body = JSON.parse(entry.response.content.text);
      delete body.token;
      delete body.password;
      delete body.ssn;
      entry.response.content.text = JSON.stringify(body);
    }
  }
  
  fs.writeFileSync(harPath, JSON.stringify(har, null, 2));
}
```

---

## Related Knowledge

- [Network First](network-first.md) - API mocking patterns
- [Visual Debugging](visual-debugging.md) - HAR in debugging
- [Playwright Config](playwright-config.md) - Configuration options

# Visual Debugging

> **Purpose**: Techniques for debugging test failures using Playwright's visual debugging tools including Trace Viewer, screenshots, videos, and HAR files.

---

## Core Debugging Tools

### Trace Viewer

The Trace Viewer provides:
- **Timeline**: Step-by-step test execution
- **Screenshots**: Before/after each action
- **DOM Snapshots**: Inspect page state at any point
- **Network**: All requests and responses
- **Console**: Browser console logs
- **Source**: Test code with execution markers

---

## Enabling Traces

### Configuration Options

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Trace options
    trace: 'on-first-retry',  // Only trace retried tests
    // trace: 'on',           // Always trace
    // trace: 'retain-on-failure', // Keep trace only on failure
    
    // Screenshot options
    screenshot: 'only-on-failure',
    
    // Video options
    video: 'retain-on-failure',
  },
});
```

### Per-Test Trace Control

```typescript
test('critical checkout flow', async ({ page, context }) => {
  // Start tracing for this specific test
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  // Test actions...
  await page.goto('/checkout');
  await page.click('[data-testid="pay-button"]');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'traces/checkout.zip' });
});
```

---

## Viewing Traces

### Local Trace Viewing

```bash
# View trace file
npx playwright show-trace trace.zip

# View trace from test results
npx playwright show-trace test-results/example-test/trace.zip
```

### CI Artifact Traces

```yaml
# .github/workflows/test.yml
- name: Upload traces
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: test-results/
    retention-days: 7
```

---

## Screenshot Strategies

### Failure Screenshots

```typescript
// Automatic on failure (via config)
screenshot: 'only-on-failure'

// Manual screenshot capture
test('visual comparison', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Capture specific element
  await page.locator('.chart').screenshot({ path: 'chart.png' });
  
  // Full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
});
```

### Before/After Screenshots

```typescript
test('form submission', async ({ page }) => {
  await page.goto('/contact');
  
  // Capture initial state
  await page.screenshot({ path: 'screenshots/form-before.png' });
  
  // Perform action
  await page.fill('[data-testid="name"]', 'Test User');
  await page.click('[data-testid="submit"]');
  
  // Capture result state
  await page.screenshot({ path: 'screenshots/form-after.png' });
});
```

---

## Video Recording

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
  },
});
```

### Video for Specific Tests

```typescript
test.describe('Critical flows', () => {
  test.use({ video: 'on' });  // Always record video
  
  test('complete checkout', async ({ page }) => {
    // Video will be saved regardless of outcome
  });
});
```

---

## HAR Files (Network Archive)

### Recording Network Traffic

```typescript
// Record HAR file
test('api interactions', async ({ page, context }) => {
  // Start recording
  await context.routeFromHAR('network.har', {
    update: true,  // Update HAR file
  });
  
  await page.goto('/dashboard');
  // All network requests are recorded
  
  // HAR file saved automatically
});
```

### Using HAR for Replay

```typescript
// Replay from recorded HAR
test('offline testing', async ({ page, context }) => {
  await context.routeFromHAR('recorded-api.har', {
    update: false,
    url: '**/api/**',
  });
  
  await page.goto('/dashboard');
  // API calls served from HAR file
});
```

---

## Debug Mode

### Interactive Debugging

```bash
# Run with debug mode
npx playwright test --debug

# Debug specific test
npx playwright test checkout.spec.ts --debug
```

### Pause in Test Code

```typescript
test('step through flow', async ({ page }) => {
  await page.goto('/login');
  
  // Pause execution - opens inspector
  await page.pause();
  
  // Continue with test
  await page.fill('[data-testid="email"]', 'test@example.com');
});
```

---

## UI Mode

### Interactive Test Runner

```bash
# Start UI mode
npx playwright test --ui

# Features:
# - Watch mode for file changes
# - Time travel debugging
# - Pick locator tool
# - Filter and search tests
```

---

## Console and Error Capture

### Capturing Browser Logs

```typescript
test('capture console output', async ({ page }) => {
  const consoleLogs: string[] = [];
  
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    consoleLogs.push(`ERROR: ${error.message}`);
  });
  
  await page.goto('/app');
  
  // Attach logs to test report
  await test.info().attach('console-logs', {
    body: consoleLogs.join('\n'),
    contentType: 'text/plain',
  });
});
```

### Error Boundary Detection

```typescript
test('detect react errors', async ({ page }) => {
  let hasError = false;
  
  page.on('console', msg => {
    if (msg.text().includes('React error boundary')) {
      hasError = true;
    }
  });
  
  await page.goto('/app');
  await page.click('[data-testid="trigger-action"]');
  
  expect(hasError).toBe(false);
});
```

---

## Artifact Organization

### Structured Output

```typescript
// playwright.config.ts
export default defineConfig({
  outputDir: 'test-results',
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'results.json' }],
  ],
  
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### Custom Artifact Attachment

```typescript
test('attach debug info', async ({ page }) => {
  // Perform test actions
  await page.goto('/dashboard');
  
  // Attach custom data
  await test.info().attach('page-html', {
    body: await page.content(),
    contentType: 'text/html',
  });
  
  await test.info().attach('local-storage', {
    body: JSON.stringify(await page.evaluate(() => localStorage)),
    contentType: 'application/json',
  });
});
```

---

## Debugging Checklist

### When a Test Fails

1. **Check the error message** - Often contains line number and assertion
2. **View the trace** - `npx playwright show-trace trace.zip`
3. **Inspect screenshots** - Before/after state at failure point
4. **Review network tab** - API responses, timing issues
5. **Check console logs** - JavaScript errors, warnings
6. **Watch the video** - See actual user experience
7. **Run in debug mode** - Step through interactively

### CI Failure Investigation

```bash
# Download artifacts from CI
# Then locally:
npx playwright show-trace test-results/test-name/trace.zip

# Or use Playwright's trace viewer URL
# https://trace.playwright.dev/
```

---

## Best Practices

| Practice | Benefit |
|----------|---------|
| Use `retain-on-failure` | Saves storage, captures what matters |
| Attach custom context | App state, user data for debugging |
| Name artifacts descriptively | Easy to find relevant files |
| Set retention policies | Balance storage vs debugging needs |
| Use trace.playwright.dev | Share traces without local setup |

---

## Related Knowledge

- [Timing Debugging](timing-debugging.md) - Debugging race conditions
- [Network First](network-first.md) - Network interception patterns
- [Test Healing Patterns](test-healing-patterns.md) - Auto-recovery strategies

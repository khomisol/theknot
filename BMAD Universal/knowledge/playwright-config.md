# Playwright Configuration

> **Purpose**: Comprehensive configuration patterns for Playwright including environment setup, timeouts, artifacts, parallelization, and project organization.

---

## Base Configuration Structure

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Timeout for each test
  timeout: 30 * 1000,
  
  // Timeout for assertions
  expect: {
    timeout: 5 * 1000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail build on test.only in CI
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Parallel workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: 'html',
  
  // Shared settings
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  
  // Browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Environment Configuration

### Multiple Environments

```typescript
// playwright.config.ts
const environments = {
  local: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:4000',
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api.staging.example.com',
  },
  production: {
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
  },
};

const env = process.env.TEST_ENV || 'local';
const config = environments[env];

export default defineConfig({
  use: {
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      'X-Environment': env,
    },
  },
  
  // Web server for local only
  webServer: env === 'local' ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
```

### Environment Variables

```typescript
// Load from .env files
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.TEST_ENV || 'local'}` });

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER!,
      password: process.env.BASIC_AUTH_PASS!,
    },
  },
});
```

---

## Timeout Configuration

### Granular Timeouts

```typescript
export default defineConfig({
  // Global test timeout
  timeout: 60 * 1000,
  
  expect: {
    // Assertion timeout
    timeout: 10 * 1000,
  },
  
  use: {
    // Action timeout (click, fill, etc.)
    actionTimeout: 15 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },
  
  // Global setup/teardown timeout
  globalTimeout: 10 * 60 * 1000,
});
```

### Per-Project Timeouts

```typescript
projects: [
  {
    name: 'fast-tests',
    testMatch: '**/unit/**',
    timeout: 10 * 1000,
  },
  {
    name: 'slow-tests',
    testMatch: '**/e2e/**',
    timeout: 120 * 1000,
  },
],
```

---

## Artifact Configuration

### Screenshots, Videos, Traces

```typescript
export default defineConfig({
  use: {
    // Screenshot options
    screenshot: 'only-on-failure',
    // screenshot: 'on',  // Always take screenshots
    
    // Video options
    video: 'retain-on-failure',
    // video: 'on',  // Always record
    // video: { mode: 'on', size: { width: 1280, height: 720 } },
    
    // Trace options
    trace: 'on-first-retry',
    // trace: 'retain-on-failure',
    // trace: 'on',  // Always capture trace
  },
  
  // Output directory
  outputDir: 'test-results',
});
```

### Custom Artifact Storage

```typescript
export default defineConfig({
  outputDir: './test-results',
  
  reporter: [
    ['html', { outputFolder: './playwright-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['junit', { outputFile: './test-results/junit.xml' }],
  ],
});
```

---

## Parallelization

### Worker Configuration

```typescript
export default defineConfig({
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Number of parallel workers
  workers: process.env.CI 
    ? 4                    // Fixed in CI
    : undefined,           // Auto-detect locally
  
  // Or percentage of CPUs
  // workers: '50%',
});
```

### Sharding for CI

```typescript
// Run with: npx playwright test --shard=1/4
export default defineConfig({
  // Sharding is handled via CLI, not config
  // But you can set up projects for logical sharding
  projects: [
    {
      name: 'critical',
      testMatch: '**/critical/**',
    },
    {
      name: 'regression',
      testMatch: '**/regression/**',
    },
  ],
});
```

### Serial vs Parallel

```typescript
// In test files, control execution order
test.describe.configure({ mode: 'serial' });

test('first', async ({ page }) => {});
test('second', async ({ page }) => {});  // Runs after first
```

---

## Project Organization

### Browser Matrix

```typescript
projects: [
  // Desktop browsers
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  
  // Mobile browsers
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  
  // Branded browsers
  { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
],
```

### Auth Setup Project

```typescript
projects: [
  // Setup project - runs first
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
  
  // Authenticated tests depend on setup
  {
    name: 'authenticated',
    dependencies: ['setup'],
    use: {
      storageState: './auth/user.json',
    },
  },
  
  // Unauthenticated tests (no dependency)
  {
    name: 'unauthenticated',
    testMatch: '**/public/**',
  },
],
```

### Tag-Based Projects

```typescript
projects: [
  {
    name: 'smoke',
    grep: /@smoke/,
    retries: 0,
  },
  {
    name: 'regression',
    grep: /@regression/,
    retries: 2,
  },
  {
    name: 'flaky',
    grep: /@flaky/,
    retries: 3,
  },
],
```

---

## Web Server Configuration

### Development Server

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Multiple Servers

```typescript
export default defineConfig({
  webServer: [
    {
      command: 'npm run dev:frontend',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev:api',
      url: 'http://localhost:4000/health',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

---

## Reporter Configuration

### Multiple Reporters

```typescript
export default defineConfig({
  reporter: [
    // Console output
    ['list'],
    
    // HTML report
    ['html', { 
      open: 'never',  // Don't auto-open
      outputFolder: 'playwright-report',
    }],
    
    // JSON for CI parsing
    ['json', { outputFile: 'results.json' }],
    
    // JUnit for CI integration
    ['junit', { outputFile: 'junit.xml' }],
    
    // GitHub Actions annotations
    process.env.CI ? ['github'] : ['dot'],
  ],
});
```

### Custom Reporter

```typescript
reporter: [
  ['./my-custom-reporter.ts', { customOption: true }],
],
```

---

## Browser Configuration

### Launch Options

```typescript
use: {
  launchOptions: {
    slowMo: process.env.SLOW_MO ? 500 : 0,
    args: ['--disable-web-security'],
  },
},
```

### Context Options

```typescript
use: {
  viewport: { width: 1280, height: 720 },
  locale: 'en-US',
  timezoneId: 'America/New_York',
  geolocation: { latitude: 40.7128, longitude: -74.0060 },
  permissions: ['geolocation'],
  colorScheme: 'dark',
  deviceScaleFactor: 2,
},
```

---

## Global Setup/Teardown

```typescript
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});

// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  // Setup tasks...
  await browser.close();
}

export default globalSetup;
```

---

## Full Production Config Example

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'local';
dotenv.config({ path: `.env.${env}` });

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  outputDir: 'test-results',
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: './auth/user.json' },
    },
    {
      name: 'firefox',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], storageState: './auth/user.json' },
    },
  ],
  
  webServer: env === 'local' ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  } : undefined,
});
```

---

## Related Knowledge

- [CI Burn-In](ci-burn-in.md) - CI pipeline patterns
- [Selective Testing](selective-testing.md) - Running subset of tests
- [Auth Session](auth-session.md) - Authentication setup

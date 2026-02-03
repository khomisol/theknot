# Selective Testing

> **Purpose**: Strategies for running targeted subsets of tests based on tags, code changes, risk levels, and promotion rules to optimize CI/CD efficiency.

---

## Why Selective Testing?

- **Faster feedback** - Run only relevant tests for changes
- **Resource efficiency** - Don't run everything on every commit
- **Risk-based coverage** - More testing for risky changes
- **Faster deployments** - Quick smoke tests for hotfixes

---

## Tag-Based Execution

### Defining Tags

```typescript
// Using test.describe with tags
test.describe('checkout @smoke @critical', () => {
  test('completes purchase', async ({ page }) => {});
});

// Using tag property
test('user registration @smoke', async ({ page }) => {});

test('password reset @regression', async ({ page }) => {});

// Multiple tags
test('admin dashboard @admin @slow @regression', async ({ page }) => {});
```

### Running Tagged Tests

```bash
# Run smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Run multiple tags (OR)
npx playwright test --grep "@smoke|@critical"

# Exclude tags
npx playwright test --grep-invert @slow

# Combine include and exclude
npx playwright test --grep @regression --grep-invert @flaky
```

### Tag-Based Projects

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      retries: 0,
      timeout: 30 * 1000,
    },
    {
      name: 'regression',
      grep: /@regression/,
      retries: 2,
      timeout: 60 * 1000,
    },
    {
      name: 'e2e',
      grepInvert: /@smoke|@unit/,
      retries: 2,
    },
  ],
});
```

---

## Diff-Based Selection

### Based on Changed Files

```bash
# Get changed files
CHANGED_FILES=$(git diff --name-only origin/main)

# Map to test files
TEST_FILES=""
for file in $CHANGED_FILES; do
  if [[ $file == src/components/* ]]; then
    TEST_FILES="$TEST_FILES tests/components/"
  elif [[ $file == src/api/* ]]; then
    TEST_FILES="$TEST_FILES tests/api/"
  elif [[ $file == src/checkout/* ]]; then
    TEST_FILES="$TEST_FILES tests/checkout/"
  fi
done

# Run relevant tests
npx playwright test $TEST_FILES
```

### Change Detection Script

```typescript
// scripts/select-tests.ts
import { execSync } from 'child_process';

function getChangedFiles(): string[] {
  const output = execSync('git diff --name-only origin/main').toString();
  return output.trim().split('\n').filter(Boolean);
}

function mapToTests(files: string[]): string[] {
  const testPatterns = new Set<string>();
  
  const mappings = [
    { pattern: /^src\/components\//, tests: ['tests/components/'] },
    { pattern: /^src\/api\//, tests: ['tests/api/', 'tests/integration/'] },
    { pattern: /^src\/checkout\//, tests: ['tests/checkout/', '@checkout'] },
    { pattern: /^src\/auth\//, tests: ['tests/auth/', '@auth'] },
    { pattern: /playwright\.config/, tests: ['@smoke'] },  // Config change = smoke
    { pattern: /package\.json/, tests: ['@smoke'] },  // Dependency change = smoke
  ];
  
  for (const file of files) {
    for (const mapping of mappings) {
      if (mapping.pattern.test(file)) {
        mapping.tests.forEach(t => testPatterns.add(t));
      }
    }
  }
  
  // If no mappings, run smoke tests
  if (testPatterns.size === 0) {
    testPatterns.add('@smoke');
  }
  
  return Array.from(testPatterns);
}

const changedFiles = getChangedFiles();
const tests = mapToTests(changedFiles);
console.log(tests.join(' '));
```

---

## Risk-Based Selection

### Priority Levels

```typescript
// Tag by priority
test('critical checkout flow @P0', async ({ page }) => {});
test('payment validation @P1', async ({ page }) => {});
test('order history display @P2', async ({ page }) => {});
test('help tooltip @P3', async ({ page }) => {});
```

### Run by Risk Level

```bash
# Critical only - fastest feedback
npx playwright test --grep @P0

# Critical + High priority
npx playwright test --grep "@P0|@P1"

# Full regression (all priorities)
npx playwright test
```

### Risk Configuration

```typescript
// playwright.config.ts
const riskLevel = process.env.RISK_LEVEL || 'full';

const riskPatterns = {
  critical: /@P0/,
  high: /@P0|@P1/,
  medium: /@P0|@P1|@P2/,
  full: undefined,  // Run all
};

export default defineConfig({
  grep: riskPatterns[riskLevel],
});
```

---

## Promotion Rules

### Environment-Based Testing

```yaml
# .github/workflows/test.yml
jobs:
  # PR checks - smoke only
  pr-tests:
    if: github.event_name == 'pull_request'
    steps:
      - run: npx playwright test --grep @smoke

  # Main branch - full regression
  main-tests:
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npx playwright test

  # Staging deploy - critical + integration
  staging-tests:
    if: github.ref == 'refs/heads/staging'
    steps:
      - run: npx playwright test --grep "@smoke|@integration"

  # Production deploy - smoke verification
  production-tests:
    if: github.ref == 'refs/heads/production'
    steps:
      - run: npx playwright test --grep @smoke --retries 0
```

### Branch-Based Config

```typescript
// playwright.config.ts
const branch = process.env.GITHUB_REF_NAME || 'local';

const branchConfig = {
  main: {
    grep: undefined,  // All tests
    retries: 2,
    workers: 4,
  },
  staging: {
    grep: /@smoke|@critical/,
    retries: 1,
    workers: 2,
  },
  'feature/*': {
    grep: /@smoke/,
    retries: 0,
    workers: 1,
  },
};

function getConfig(branch: string) {
  if (branchConfig[branch]) return branchConfig[branch];
  for (const [pattern, config] of Object.entries(branchConfig)) {
    if (pattern.includes('*') && branch.startsWith(pattern.replace('*', ''))) {
      return config;
    }
  }
  return branchConfig['feature/*'];
}

const config = getConfig(branch);

export default defineConfig({
  grep: config.grep,
  retries: config.retries,
  workers: config.workers,
});
```

---

## Test File Organization

### Directory-Based Selection

```
tests/
  smoke/              # npx playwright test tests/smoke
    login.spec.ts
    homepage.spec.ts
  regression/         # npx playwright test tests/regression
    checkout.spec.ts
    profile.spec.ts
  integration/        # npx playwright test tests/integration
    api.spec.ts
  e2e/               # npx playwright test tests/e2e
    full-flow.spec.ts
```

### Running by Directory

```bash
# Smoke tests only
npx playwright test tests/smoke/

# Multiple directories
npx playwright test tests/smoke/ tests/integration/

# Pattern matching
npx playwright test tests/**/checkout*.spec.ts
```

---

## Dynamic Test Generation

### Skip Based on Conditions

```typescript
test.describe('admin features', () => {
  test.skip(!process.env.ADMIN_TESTS, 'Skipping admin tests');
  
  test('admin dashboard', async ({ page }) => {});
});

test.describe('beta features', () => {
  test.skip(process.env.TEST_ENV === 'production', 'Beta not in prod');
  
  test('beta feature', async ({ page }) => {});
});
```

### Conditional Test Inclusion

```typescript
// Only run on specific browsers
test('webkit-specific test', async ({ browserName, page }) => {
  test.skip(browserName !== 'webkit', 'WebKit only');
  // test code
});

// Only run in CI
test('ci-only test', async ({ page }) => {
  test.skip(!process.env.CI, 'CI only');
  // test code
});
```

---

## Sharding Strategies

### CI Sharding

```yaml
# GitHub Actions matrix
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}/4
```

### Logical Sharding

```typescript
// playwright.config.ts
projects: [
  {
    name: 'shard-1-critical',
    testMatch: ['**/checkout/**', '**/auth/**'],
  },
  {
    name: 'shard-2-features',
    testMatch: ['**/features/**'],
  },
  {
    name: 'shard-3-regression',
    testMatch: ['**/regression/**'],
  },
],
```

---

## Test Selection CLI

### Helper Script

```typescript
// scripts/run-tests.ts
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const options: string[] = [];

// Parse arguments
if (args.includes('--smoke')) options.push('--grep @smoke');
if (args.includes('--critical')) options.push('--grep @P0');
if (args.includes('--fast')) options.push('--grep-invert @slow');
if (args.includes('--no-flaky')) options.push('--grep-invert @flaky');

// Environment-based
if (process.env.CI) {
  options.push('--retries 2');
}

const command = `npx playwright test ${options.join(' ')}`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:critical": "playwright test --grep @P0",
    "test:fast": "playwright test --grep-invert @slow",
    "test:changed": "ts-node scripts/select-tests.ts | xargs playwright test"
  }
}
```

---

## Best Practices

| Scenario | Strategy |
|----------|----------|
| PR check | Smoke tests only |
| Main merge | Full regression |
| Hotfix | Critical path only |
| Feature branch | Related tests + smoke |
| Nightly | All tests + slow tests |
| Deploy verification | Smoke + integration |

---

## Anti-Patterns

```typescript
// ❌ Running all tests on every commit
// Wastes resources, slow feedback

// ❌ Only running smoke tests
// Missing coverage for regression

// ❌ Skipping tests without reason
test.skip('broken test');  // Why?

// ✅ Document skip reasons
test.skip('broken test', 'Issue #123 - fix pending');

// ✅ Balance speed with coverage
// PR: smoke → Merge: full → Deploy: smoke
```

---

## Related Knowledge

- [CI Burn-In](ci-burn-in.md) - CI pipeline strategies
- [Test Priorities Matrix](test-priorities-matrix.md) - Priority classification
- [Playwright Config](playwright-config.md) - Configuration options

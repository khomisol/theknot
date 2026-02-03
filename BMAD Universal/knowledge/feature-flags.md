# Feature Flag Testing

> **Purpose**: Comprehensive testing strategies for applications using feature flags, ensuring both flag states are tested and flags are properly governed.

---

## Why Feature Flags Require Special Testing

Feature flags create **multiple runtime configurations**:
- A single codebase can behave differently based on flag states
- Untested flag combinations can cause production issues
- Flag cleanup debt can accumulate without governance

---

## Testing Both States

### Flag-Aware Test Structure

```typescript
// tests/feature/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.describe('with new-checkout-flow enabled', () => {
    test.use({ 
      storageState: './auth/user.json',
    });
    
    test.beforeEach(async ({ page }) => {
      // Enable feature flag via API or localStorage
      await page.addInitScript(() => {
        localStorage.setItem('ff_new_checkout_flow', 'true');
      });
    });
    
    test('shows streamlined checkout', async ({ page }) => {
      await page.goto('/checkout');
      await expect(page.getByTestId('streamlined-checkout')).toBeVisible();
    });
  });
  
  test.describe('with new-checkout-flow disabled', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('ff_new_checkout_flow', 'false');
      });
    });
    
    test('shows classic checkout', async ({ page }) => {
      await page.goto('/checkout');
      await expect(page.getByTestId('classic-checkout')).toBeVisible();
    });
  });
});
```

---

## Feature Flag Fixture

### Centralized Flag Control

```typescript
// fixtures/feature-flags.fixture.ts
import { test as base } from '@playwright/test';

type FeatureFlags = {
  newCheckout: boolean;
  darkMode: boolean;
  betaFeatures: boolean;
};

type FeatureFlagFixtures = {
  featureFlags: FeatureFlags;
  setFeatureFlags: (flags: Partial<FeatureFlags>) => Promise<void>;
};

export const test = base.extend<FeatureFlagFixtures>({
  featureFlags: [{ newCheckout: false, darkMode: false, betaFeatures: false }, { option: true }],
  
  setFeatureFlags: async ({ page }, use) => {
    const setFlags = async (flags: Partial<FeatureFlags>) => {
      await page.addInitScript((flagValues) => {
        Object.entries(flagValues).forEach(([key, value]) => {
          localStorage.setItem(`ff_${key}`, String(value));
        });
      }, flags);
    };
    
    await use(setFlags);
  },
  
  page: async ({ page, featureFlags, setFeatureFlags }, use) => {
    await setFeatureFlags(featureFlags);
    await use(page);
  },
});
```

### Using the Fixture

```typescript
// Test with specific flag configuration
test.describe('Beta features', () => {
  test.use({ featureFlags: { betaFeatures: true, newCheckout: true } });
  
  test('shows beta dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('beta-badge')).toBeVisible();
  });
});
```

---

## API-Based Flag Control

### LaunchDarkly Example

```typescript
// fixtures/launchdarkly.fixture.ts
import { test as base } from '@playwright/test';
import LaunchDarkly from 'launchdarkly-node-server-sdk';

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!);

export const test = base.extend({
  withFlag: async ({}, use) => {
    const flagOverrides: Map<string, any> = new Map();
    
    const setFlag = async (flagKey: string, value: any) => {
      flagOverrides.set(flagKey, value);
      // Use LD's test data source or API to override
    };
    
    await use(setFlag);
    
    // Reset flags after test
    for (const [key] of flagOverrides) {
      // Reset to default value
    }
  },
});
```

### Mock Flag Provider

```typescript
// fixtures/mock-flags.fixture.ts
export const test = base.extend({
  page: async ({ page }, use) => {
    // Intercept flag provider requests
    await page.route('**/api/feature-flags', async (route) => {
      const testFlags = {
        'new-checkout': true,
        'dark-mode': false,
        'beta-features': process.env.TEST_BETA === 'true',
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(testFlags),
      });
    });
    
    await use(page);
  },
});
```

---

## Flag Combination Testing

### Matrix Testing Approach

```typescript
// tests/flag-matrix.spec.ts
const flagCombinations = [
  { newCheckout: false, darkMode: false },
  { newCheckout: true, darkMode: false },
  { newCheckout: false, darkMode: true },
  { newCheckout: true, darkMode: true },
];

for (const flags of flagCombinations) {
  test.describe(`Flags: ${JSON.stringify(flags)}`, () => {
    test.use({ featureFlags: flags });
    
    test('checkout completes successfully', async ({ page }) => {
      await page.goto('/checkout');
      await page.fill('[data-testid="card-number"]', '4242424242424242');
      await page.click('[data-testid="pay-button"]');
      await expect(page.getByText('Payment successful')).toBeVisible();
    });
  });
}
```

### Critical Path Testing

```typescript
// Focus on user-facing combinations, not all permutations
const criticalCombinations = [
  // Production default
  { newCheckout: false, betaFeatures: false },
  // Gradual rollout state
  { newCheckout: true, betaFeatures: false },
  // Full new experience
  { newCheckout: true, betaFeatures: true },
];
```

---

## Flag Governance

### Flag Registry

```typescript
// feature-flags.registry.ts
interface FeatureFlagDefinition {
  key: string;
  description: string;
  owner: string;
  createdDate: string;
  plannedRemovalDate: string;
  testCoverage: {
    enabledTests: string[];
    disabledTests: string[];
  };
}

export const featureFlagRegistry: FeatureFlagDefinition[] = [
  {
    key: 'new-checkout-flow',
    description: 'Streamlined checkout experience',
    owner: 'checkout-team',
    createdDate: '2024-01-15',
    plannedRemovalDate: '2024-04-01',
    testCoverage: {
      enabledTests: ['checkout/new-flow.spec.ts'],
      disabledTests: ['checkout/classic-flow.spec.ts'],
    },
  },
];
```

### Flag Cleanup Verification

```typescript
// tests/flag-governance.spec.ts
import { featureFlagRegistry } from '../feature-flags.registry';

test('all flags have test coverage for both states', () => {
  for (const flag of featureFlagRegistry) {
    expect(flag.testCoverage.enabledTests.length).toBeGreaterThan(0);
    expect(flag.testCoverage.disabledTests.length).toBeGreaterThan(0);
  }
});

test('no flags past removal date', () => {
  const today = new Date();
  const overdueFlags = featureFlagRegistry.filter(
    flag => new Date(flag.plannedRemovalDate) < today
  );
  
  expect(overdueFlags).toHaveLength(0);
});
```

---

## CI Integration

### Test Both States in Pipeline

```yaml
# .github/workflows/test.yml
jobs:
  test-feature-flags:
    strategy:
      matrix:
        feature-set:
          - name: 'production-defaults'
            flags: ''
          - name: 'new-features-enabled'
            flags: 'NEW_CHECKOUT=true,BETA_FEATURES=true'
    
    steps:
      - name: Run tests with ${{ matrix.feature-set.name }}
        env:
          FEATURE_FLAGS: ${{ matrix.feature-set.flags }}
        run: npx playwright test
```

### Flag-Specific Test Tags

```typescript
// Tag tests by flag dependency
test('new checkout shows payment options', {
  tag: ['@flag:new-checkout', '@flag:enabled'],
}, async ({ page }) => {
  // test implementation
});

// Run only tests for specific flag
// npx playwright test --grep @flag:new-checkout
```

---

## Best Practices

### Do's

- ✅ Test both enabled and disabled states for every flag
- ✅ Maintain a flag registry with ownership and removal dates
- ✅ Include flag state in test reports for debugging
- ✅ Test flag transitions (what happens when flag changes mid-session)
- ✅ Run flag matrix tests in CI, not just default state

### Don'ts

- ❌ Assume flags will always be cleaned up
- ❌ Test only the "new" state, ignoring the "old" state
- ❌ Create tests that depend on multiple flags without documenting
- ❌ Leave flag cleanup to "later" without tracking dates

---

## Flag State in Test Reports

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      // Include flag state in report
    }],
    ['json', { 
      outputFile: 'results.json',
    }],
  ],
  metadata: {
    featureFlags: process.env.FEATURE_FLAGS || 'defaults',
  },
});
```

---

## Related Knowledge

- [Test Levels](test-levels.md) - When to test flags at each level
- [Selective Testing](selective-testing.md) - Running flag-specific tests
- [CI Burn-In](ci-burn-in.md) - Validating flag rollouts

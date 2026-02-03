# Test Priorities Matrix

> **Purpose**: Framework for classifying tests into priority levels (P0-P3) based on business impact, risk, and user journey criticality.

---

## Priority Levels Overview

| Priority | Name | Description | Run Frequency |
|----------|------|-------------|---------------|
| P0 | Critical | Core functionality, revenue-impacting | Every commit |
| P1 | High | Important features, significant impact | Every PR |
| P2 | Medium | Standard features, moderate impact | Daily/Nightly |
| P3 | Low | Edge cases, nice-to-have | Weekly/Release |

---

## P0 - Critical Tests

### Characteristics
- Blocks revenue/core business
- Affects majority of users
- No workaround available
- Security/data integrity issues

### Examples
```typescript
// Login/Authentication
test('user can login with valid credentials @P0', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', user.email);
  await page.fill('[data-testid="password"]', user.password);
  await page.click('[data-testid="login"]');
  await expect(page).toHaveURL('/dashboard');
});

// Payment/Checkout
test('checkout completes successfully @P0', async ({ page }) => {
  await addItemToCart(page);
  await page.goto('/checkout');
  await completePayment(page);
  await expect(page.getByText('Order confirmed')).toBeVisible();
});

// Data integrity
test('user data is persisted correctly @P0', async ({ page }) => {
  await createRecord(page, testData);
  await page.reload();
  await verifyRecordExists(page, testData);
});
```

### P0 Test Requirements
- Zero flakiness tolerance
- Must complete in < 30 seconds
- Clear failure diagnostics
- Runs on every commit

---

## P1 - High Priority Tests

### Characteristics
- Important user workflows
- Significant UX impact
- Workaround may exist
- Affects substantial user segment

### Examples
```typescript
// Profile management
test('user can update profile @P1', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('[data-testid="name"]', 'New Name');
  await page.click('[data-testid="save"]');
  await expect(page.getByText('Profile updated')).toBeVisible();
});

// Search functionality
test('search returns relevant results @P1', async ({ page }) => {
  await page.goto('/search');
  await page.fill('[data-testid="search"]', 'widget');
  await page.click('[data-testid="search-button"]');
  await expect(page.getByTestId('results')).toContainText('widget');
});

// Navigation
test('main navigation works @P1', async ({ page }) => {
  await page.goto('/');
  for (const link of mainNavLinks) {
    await page.click(`[data-testid="nav-${link}"]`);
    await expect(page).toHaveURL(link);
  }
});
```

### P1 Test Requirements
- < 1% flaky rate
- Must complete in < 60 seconds
- Runs on every PR
- Blocks merge on failure

---

## P2 - Medium Priority Tests

### Characteristics
- Standard features
- Moderate business impact
- Workarounds available
- Affects smaller user segment

### Examples
```typescript
// Sorting/filtering
test('products can be sorted by price @P2', async ({ page }) => {
  await page.goto('/products');
  await page.selectOption('[data-testid="sort"]', 'price-asc');
  const prices = await page.getByTestId('price').allTextContents();
  expect(isSorted(prices)).toBe(true);
});

// Notifications
test('user receives email notification @P2', async ({ page }) => {
  await triggerNotification(page);
  const email = await waitForEmail(testUser.email);
  expect(email).toBeDefined();
});

// Export features
test('report exports to CSV @P2', async ({ page }) => {
  await page.goto('/reports');
  const download = await downloadReport(page, 'csv');
  expect(download.suggestedFilename()).toContain('.csv');
});
```

### P2 Test Requirements
- < 5% flaky rate acceptable
- May run in nightly builds
- Does not block PRs
- Review weekly

---

## P3 - Low Priority Tests

### Characteristics
- Edge cases
- Rare user scenarios
- Cosmetic/minor UX
- Low business impact

### Examples
```typescript
// Edge cases
test('handles extremely long product names @P3', async ({ page }) => {
  const longName = 'A'.repeat(500);
  await createProduct(page, { name: longName });
  await expect(page.getByTestId('product-name')).toBeVisible();
});

// Accessibility edge cases
test('screen reader announces loading state @P3', async ({ page }) => {
  await page.goto('/slow-page');
  await expect(page.getByRole('status')).toHaveAttribute('aria-busy', 'true');
});

// Rare scenarios
test('handles timezone edge case @P3', async ({ page }) => {
  await page.emulateTimezone('Pacific/Kiritimati');
  await page.goto('/calendar');
  await expect(page.getByTestId('date')).toBeVisible();
});
```

### P3 Test Requirements
- May be skipped if flaky
- Runs weekly or pre-release
- Does not block deployment
- Document skip reasons

---

## Priority Assignment Matrix

### By Business Impact

| Impact | Revenue | Users Affected | Priority |
|--------|---------|----------------|----------|
| Severe | Blocks sales | All | P0 |
| High | Reduces conversions | Majority | P1 |
| Medium | Degrades experience | Some | P2 |
| Low | Minor inconvenience | Few | P3 |

### By Feature Area

| Area | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| Authentication | Login, SSO | Password reset | Session management | Remember me |
| Checkout | Payment, Cart | Shipping options | Order history | Gift wrapping |
| Search | Core search | Filters | Sort options | Search history |
| Profile | Save profile | Update details | Preferences | Avatar upload |

---

## Implementation

### Tagging Tests

```typescript
// In test files
test('critical flow @P0 @smoke', async ({ page }) => {});
test('important feature @P1', async ({ page }) => {});
test('standard feature @P2 @regression', async ({ page }) => {});
test('edge case @P3', async ({ page }) => {});
```

### Running by Priority

```bash
# Critical only (fastest feedback)
npx playwright test --grep @P0

# P0 + P1 (PR checks)
npx playwright test --grep "@P0|@P1"

# Full suite (nightly)
npx playwright test

# Exclude low priority (quick regression)
npx playwright test --grep-invert @P3
```

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'critical',
      grep: /@P0/,
      retries: 0,  // No retries - must be stable
      timeout: 30 * 1000,
    },
    {
      name: 'high',
      grep: /@P0|@P1/,
      retries: 1,
      timeout: 60 * 1000,
    },
    {
      name: 'full',
      retries: 2,
      timeout: 120 * 1000,
    },
  ],
});
```

---

## Priority Review Process

### When to Upgrade Priority

- Feature becomes more critical to business
- Bug found in production that test would catch
- User complaints increase for feature
- Feature moves to critical path

### When to Downgrade Priority

- Feature is deprecated/replaced
- Better tests cover the scenario
- Feature rarely used (analytics confirm)
- Alternative workarounds exist

### Review Cadence

| Priority | Review Frequency |
|----------|------------------|
| P0 | Every sprint |
| P1 | Monthly |
| P2 | Quarterly |
| P3 | Biannually |

---

## Metrics to Track

### By Priority

```typescript
// In reporter or afterEach hook
interface PriorityMetrics {
  priority: string;
  totalTests: number;
  passRate: number;
  avgDuration: number;
  flakyRate: number;
}

// Track and report
const metrics = collectMetrics(testResults);
reportPriorityMetrics(metrics);
```

### Health Indicators

| Metric | P0 Target | P1 Target | P2 Target |
|--------|-----------|-----------|-----------|
| Pass rate | 100% | > 99% | > 95% |
| Flaky rate | 0% | < 1% | < 5% |
| Avg duration | < 30s | < 60s | < 120s |
| Coverage | 100% critical | 90% important | 80% standard |

---

## Related Knowledge

- [Probability Impact](probability-impact.md) - Risk scoring
- [Selective Testing](selective-testing.md) - Running by priority
- [Risk Governance](risk-governance.md) - Managing test risk

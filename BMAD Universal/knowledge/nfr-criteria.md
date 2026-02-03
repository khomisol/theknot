# Non-Functional Requirements (NFR) Criteria

> **Purpose**: Criteria and testing approaches for validating non-functional requirements including security, performance, reliability, and maintainability.

---

## What are NFRs?

Non-Functional Requirements define **how** a system behaves, not **what** it does:
- Performance - Speed, throughput, latency
- Security - Protection, authentication, authorization
- Reliability - Availability, fault tolerance, recovery
- Maintainability - Code quality, testability, documentation
- Scalability - Growth capacity, resource efficiency

---

## Security NFRs

### Authentication Testing

| Criterion | Test Approach |
|-----------|---------------|
| Session timeout | Verify session expires after inactivity |
| Token security | Ensure tokens are HTTP-only, secure |
| Password policy | Validate complexity requirements |
| MFA support | Test multi-factor flows |
| Brute force protection | Verify lockout after failed attempts |

```typescript
test('session expires after inactivity', async ({ page }) => {
  await loginAs(page, testUser);
  
  // Wait for session timeout (use short timeout in test env)
  await page.waitForTimeout(parseInt(process.env.SESSION_TIMEOUT_MS!) + 1000);
  
  // Attempt action requiring auth
  await page.goto('/dashboard');
  
  // Should redirect to login
  await expect(page).toHaveURL('/login');
});

test('account locks after failed login attempts', async ({ page }) => {
  await page.goto('/login');
  
  // Attempt wrong password multiple times
  for (let i = 0; i < 5; i++) {
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login"]');
  }
  
  // Should show lockout message
  await expect(page.getByText('Account temporarily locked')).toBeVisible();
});
```

### Authorization Testing

| Criterion | Test Approach |
|-----------|---------------|
| Role-based access | Verify permissions per role |
| Resource ownership | Users can only access own data |
| API authorization | Backend validates permissions |
| CSRF protection | Verify token validation |

```typescript
test('regular user cannot access admin features', async ({ page }) => {
  await loginAs(page, regularUser);
  
  await page.goto('/admin/dashboard');
  
  await expect(page).toHaveURL('/unauthorized');
});

test('user cannot access another user data', async ({ request }) => {
  // Login as user A
  const authA = await getAuthToken(userA);
  
  // Try to access user B's data
  const response = await request.get(`/api/users/${userB.id}/profile`, {
    headers: { Authorization: `Bearer ${authA}` },
  });
  
  expect(response.status()).toBe(403);
});
```

### Data Security

| Criterion | Test Approach |
|-----------|---------------|
| Encryption in transit | Verify HTTPS enforcement |
| Sensitive data masking | PII not exposed in logs/UI |
| Input sanitization | XSS/injection prevention |
| Secure headers | CSP, HSTS, X-Frame-Options |

---

## Performance NFRs

### Response Time Criteria

| Page Type | Target | Maximum |
|-----------|--------|---------|
| Static pages | < 500ms | 1s |
| Dashboard | < 1s | 2s |
| Search results | < 2s | 3s |
| Report generation | < 5s | 10s |

```typescript
test('dashboard loads within 2 seconds', async ({ page }) => {
  const start = Date.now();
  
  await page.goto('/dashboard');
  await page.waitForSelector('[data-testid="dashboard-content"]');
  
  const loadTime = Date.now() - start;
  
  expect(loadTime).toBeLessThan(2000);
});
```

### Throughput Testing

```typescript
test('API handles concurrent requests', async ({ request }) => {
  const concurrentRequests = 50;
  
  const requests = Array(concurrentRequests).fill(null).map(() =>
    request.get('/api/products')
  );
  
  const responses = await Promise.all(requests);
  
  const successRate = responses.filter(r => r.ok()).length / concurrentRequests;
  const avgTime = responses.reduce((sum, r) => sum + r.headers()['x-response-time'], 0) / concurrentRequests;
  
  expect(successRate).toBeGreaterThan(0.99);
  expect(avgTime).toBeLessThan(500);
});
```

### Resource Utilization

| Metric | Threshold |
|--------|-----------|
| Memory usage | < 200MB per user session |
| CPU spikes | < 80% sustained |
| Bundle size | < 500KB gzipped |
| Image optimization | WebP, lazy loading |

---

## Reliability NFRs

### Availability Targets

| Tier | Uptime | Downtime/month |
|------|--------|----------------|
| Standard | 99% | ~7.2 hours |
| High | 99.9% | ~43 minutes |
| Critical | 99.99% | ~4 minutes |

### Fault Tolerance Testing

```typescript
test('app handles API failures gracefully', async ({ page }) => {
  // Simulate API failure
  await page.route('**/api/**', route => route.abort('failed'));
  
  await page.goto('/dashboard');
  
  // Should show error state, not crash
  await expect(page.getByText('Unable to load data')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});

test('app recovers from transient errors', async ({ page }) => {
  let requestCount = 0;
  
  await page.route('**/api/data', route => {
    requestCount++;
    if (requestCount < 3) {
      route.fulfill({ status: 503 });
    } else {
      route.fulfill({ json: { data: 'success' } });
    }
  });
  
  await page.goto('/dashboard');
  
  // Auto-retry should succeed
  await expect(page.getByText('success')).toBeVisible();
});
```

### Data Integrity

| Criterion | Validation |
|-----------|------------|
| Transaction consistency | ACID compliance |
| Data validation | Server-side validation |
| Backup verification | Regular restore tests |
| Audit logging | All changes tracked |

---

## Maintainability NFRs

### Code Quality Metrics

| Metric | Target |
|--------|--------|
| Test coverage | > 80% |
| Cyclomatic complexity | < 10 per function |
| Technical debt | < 5% of codebase |
| Documentation | All public APIs documented |

### Test Quality Criteria

| Criterion | Target |
|-----------|--------|
| Flaky test rate | < 1% |
| Test execution time | < 10 minutes for full suite |
| Test independence | No shared state between tests |
| Test readability | Clear naming, assertions |

```typescript
// Measure test stability
test.afterEach(async ({}, testInfo) => {
  if (testInfo.retry > 0) {
    console.warn(`Flaky test: ${testInfo.title}`);
    // Track flaky tests for investigation
  }
});
```

---

## Scalability NFRs

### Growth Capacity

| Metric | Current | Target |
|--------|---------|--------|
| Concurrent users | 100 | 10,000 |
| Data volume | 1GB | 100GB |
| Requests/second | 100 | 1,000 |

### Load Testing Scenarios

```typescript
// Using k6 or similar
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Sustained load
    { duration: '2m', target: 500 },   // Spike
    { duration: '5m', target: 500 },   // Sustained spike
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

---

## Accessibility NFRs

### WCAG Compliance

| Level | Criteria |
|-------|----------|
| A | Basic accessibility |
| AA | Standard (required for most) |
| AAA | Enhanced accessibility |

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page meets WCAG 2.1 AA standards', async ({ page }) => {
  await page.goto('/dashboard');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

---

## NFR Test Organization

### By Category

```
tests/
  nfr/
    security/
      auth.spec.ts
      authorization.spec.ts
      data-protection.spec.ts
    performance/
      load-times.spec.ts
      throughput.spec.ts
    reliability/
      fault-tolerance.spec.ts
      recovery.spec.ts
    accessibility/
      wcag.spec.ts
```

### Tagging Strategy

```typescript
test('session timeout @security @nfr', async ({ page }) => {});
test('page load time @performance @nfr', async ({ page }) => {});
test('error recovery @reliability @nfr', async ({ page }) => {});
```

---

## NFR Reporting

### Dashboard Metrics

```typescript
// Collect NFR metrics in test results
test.afterEach(async ({}, testInfo) => {
  const metrics = testInfo.attachments.find(a => a.name === 'metrics');
  
  if (metrics) {
    // Send to monitoring dashboard
    await reportNFRMetrics({
      test: testInfo.title,
      category: testInfo.tags.find(t => t.startsWith('@nfr-')),
      duration: testInfo.duration,
      status: testInfo.status,
      metrics: JSON.parse(metrics.body.toString()),
    });
  }
});
```

---

## Related Knowledge

- [Test Priorities Matrix](test-priorities-matrix.md) - Prioritizing NFR tests
- [Probability Impact](probability-impact.md) - Risk assessment
- [Risk Governance](risk-governance.md) - Managing test risks

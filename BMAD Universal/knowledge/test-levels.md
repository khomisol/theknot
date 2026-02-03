# Test Levels Framework

## Principle

Choose the right test level for each scenario. Unit tests for business logic (fast, many), integration tests for boundaries (medium), E2E tests for critical paths only (slow, few). Follow the test pyramid—lower levels catch more bugs faster.

---

## Test Pyramid

```
        /\
       /  \      E2E (10%)
      /----\     Critical user journeys only
     /      \
    /--------\   Integration (20%)
   /          \  Component interactions, API contracts
  /------------\ 
 /              \ Unit (70%)
/________________\ Fast, isolated, comprehensive
```

---

## When to Use Each Level

### Unit Tests (70%)

**Use for:**
- Business logic and calculations
- Data transformations
- Utility functions
- State management
- Input validation

**Characteristics:**
- Execute in milliseconds
- No external dependencies (DB, network, filesystem)
- Mock all boundaries
- Run on every commit

```typescript
// Unit test example
test('calculateDiscount applies percentage correctly', () => {
  expect(calculateDiscount(100, 0.2)).toBe(80);
  expect(calculateDiscount(50, 0.1)).toBe(45);
  expect(calculateDiscount(100, 0)).toBe(100);
});
```

### Integration Tests (20%)

**Use for:**
- API endpoints
- Database queries
- Service-to-service communication
- External API integrations
- Component rendering with data

**Characteristics:**
- Execute in seconds
- Use real or containerized dependencies
- Test contracts and boundaries
- Run on PR/push

```typescript
// Integration test example
test('POST /api/users creates user in database', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ email: 'test@example.com', name: 'Test' });
  
  expect(response.status).toBe(201);
  
  const user = await db.users.findByEmail('test@example.com');
  expect(user).toBeDefined();
});
```

### E2E Tests (10%)

**Use for:**
- Critical user journeys (signup, checkout, payment)
- Cross-system flows
- Visual regression
- Accessibility validation

**Characteristics:**
- Execute in minutes
- Full stack, real browser
- Test user perspective
- Run before deploy

```typescript
// E2E test example
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.goto('/checkout');
  await page.fill('[data-testid="card"]', '4111111111111111');
  await page.click('[data-testid="pay"]');
  
  await expect(page.getByText('Order Confirmed')).toBeVisible();
});
```

---

## Decision Matrix

| Scenario | Recommended Level |
|----------|------------------|
| Pure function with logic | Unit |
| API endpoint behavior | Integration |
| Database query | Integration |
| Component render | Unit (with mocks) |
| Full user flow | E2E |
| Error handling | Unit + Integration |
| Authentication flow | Integration + E2E (critical path) |
| Third-party API | Integration (mocked) |

---

## Coverage Targets

| Level | Target | Reasoning |
|-------|--------|-----------|
| Unit | >80% | Cheap to write, fast to run |
| Integration | >60% | Key boundaries covered |
| E2E | Critical paths 100% | Expensive, focus on essentials |

---

## Anti-Patterns

❌ **Testing implementation details**
- Don't test private methods directly
- Test public API/behavior

❌ **E2E for everything**
- Slow, flaky, expensive
- Use unit tests for logic

❌ **Mocking everything in integration tests**
- Defeats the purpose
- Test real interactions

❌ **No tests for error paths**
- Happy path only = production surprises
- Test error handling at each level

---

## Related Knowledge

- `test-quality.md` - Quality standards
- `test-priorities.md` - P0-P3 classification
- `fixture-architecture.md` - Test infrastructure

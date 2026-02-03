# Workflow: Test Automation (TA)

## Purpose
Implement automated tests based on test specifications, following framework conventions.

## Agent
Test Architect (TEA) - Tessa

## Command
`*automate` or `*automate [test-spec]`

---

## Prerequisites

- Test framework established (`*framework`)
- Test design completed (`*test-design`)
- Development environment ready

---

## Process

### Step 1: Review Test Specification

Load:
- Test specification document
- Test framework conventions
- Related source code

**Identify:**
- Test cases to automate
- Priority order
- Dependencies between tests

### Step 2: Setup Test Structure

Follow framework conventions:

```
tests/
├── unit/
│   └── [feature]/
│       └── [component].test.ts
├── integration/
│   └── [feature]/
│       └── [flow].test.ts
└── e2e/
    └── [journey]/
        └── [scenario].test.ts
```

### Step 3: Implement Tests

**For each test case:**

1. **Arrange** - Setup test data, mocks, state
2. **Act** - Execute the action under test
3. **Assert** - Verify expected outcomes

**Example Pattern (TypeScript/Jest):**
```typescript
describe('Feature: [Name]', () => {
  describe('when [scenario]', () => {
    it('should [expected behavior]', async () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### Step 4: Test Data Setup

**Strategies:**

1. **Fixtures** - Static test data files
```typescript
import { userFixture } from '../fixtures/user';
```

2. **Factories** - Dynamic test data generation
```typescript
const user = createUser({ role: 'admin' });
```

3. **Builders** - Fluent test data construction
```typescript
const order = OrderBuilder.create()
  .withItems(3)
  .withStatus('pending')
  .build();
```

### Step 5: Mocking External Dependencies

**Mock patterns:**

```typescript
// Service mock
jest.mock('../services/payment', () => ({
  processPayment: jest.fn().mockResolvedValue({ success: true })
}));

// API mock
nock('https://api.external.com')
  .get('/resource')
  .reply(200, { data: 'mocked' });
```

### Step 6: Verify and Refine

1. **Run tests** - Ensure all pass
2. **Check coverage** - Meet targets
3. **Review isolation** - No test interdependence
4. **Verify speed** - Within acceptable limits

```bash
# Run with coverage
npm test -- --coverage

# Run specific suite
npm test -- [pattern]
```

---

## Output

- Implemented test files
- Test data fixtures/factories
- Mock configurations
- Updated coverage report

---

## Test Quality Checklist

- [ ] Tests are independent (can run in any order)
- [ ] Tests are deterministic (same result every run)
- [ ] Tests are fast (unit < 10ms, integration < 1s)
- [ ] Tests have clear names (describe behavior)
- [ ] Tests cover happy path and edge cases
- [ ] Mocks are minimal and necessary
- [ ] Assertions are specific and meaningful

---

## Common Patterns

### Testing Async Code
```typescript
it('handles async operations', async () => {
  await expect(asyncFn()).resolves.toBe(expected);
  await expect(failingFn()).rejects.toThrow('error');
});
```

### Testing Error Handling
```typescript
it('throws on invalid input', () => {
  expect(() => fn(invalidInput)).toThrow(ValidationError);
});
```

### Testing API Endpoints
```typescript
it('returns 200 with data', async () => {
  const response = await request(app)
    .get('/api/resource')
    .expect(200);
  
  expect(response.body).toHaveProperty('data');
});
```

---

## Anti-Patterns

1. ❌ Testing implementation, not behavior
2. ❌ Overly complex test setup
3. ❌ Multiple assertions testing unrelated things
4. ❌ Tests that require specific execution order
5. ❌ Hardcoded dates/times causing flakiness

---

## Next Steps

After automation:
- `*ci` - Configure CI pipeline
- `*test-review` - Review test quality

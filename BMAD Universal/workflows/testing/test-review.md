# Workflow: Test Review (RV)

## Purpose
Review and assess test quality, coverage, and effectiveness.

## Agent
Test Architect (TEA) - Tessa

## Command
`*test-review`

---

## Prerequisites

- Tests implemented
- CI running (coverage reports available)

---

## Process

### Step 1: Gather Metrics

**Collect:**
- Coverage reports
- Test execution times
- Failure rates
- Flaky test history

**Key metrics:**
- Line coverage %
- Branch coverage %
- Test count by type
- Average execution time
- Tests per module/feature

### Step 2: Analyze Coverage

**Review coverage report:**

```bash
# Generate coverage
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

**Identify gaps:**
- Modules < 80% coverage
- Untested branches
- Dead code
- Complex functions without tests

### Step 3: Assess Test Quality

**Quality indicators:**

| Indicator | Good | Concern |
|-----------|------|---------|
| Isolation | No shared state | Tests depend on order |
| Speed | Unit <10ms | Unit >100ms |
| Determinism | 100% consistent | Intermittent failures |
| Clarity | Self-documenting | Comments needed |
| Maintenance | Easy to update | Brittle to changes |

**Review checklist:**
- [ ] Tests describe behavior, not implementation
- [ ] Each test verifies one thing
- [ ] Setup/teardown is minimal
- [ ] Mocks are appropriate
- [ ] Edge cases covered
- [ ] Error paths tested

### Step 4: Identify Flaky Tests

**Signs of flakiness:**
- Intermittent CI failures
- Time-dependent assertions
- Order-dependent execution
- External service dependencies

**Investigation:**
```bash
# Run multiple times
for i in {1..10}; do npm test; done

# Run in isolation
npm test -- --runInBand
```

### Step 5: Generate Report

```markdown
# Test Review Report

## Summary
- Total tests: X
- Coverage: Y%
- Average execution: Z seconds

## Coverage Analysis
### Well-covered (>80%)
- module/feature: 95%

### Needs attention (<80%)
- module/feature: 65%
  - Missing: [specific scenarios]

## Quality Issues
### High Priority
1. [Flaky test description]
   - Location: path/to/test
   - Issue: [root cause]
   - Fix: [recommendation]

### Medium Priority
1. [Issue description]

## Recommendations
1. [Specific actionable item]
2. [Specific actionable item]

## Metrics Trend
- Coverage: ↑ from X% to Y%
- Execution time: ↓ from X to Y seconds
```

---

## Output

- Test review report
- Prioritized improvement list
- Coverage gap analysis
- Flaky test identification

---

## Test Smells to Look For

### Fragile Tests
- Test breaks when implementation changes
- Overly specific assertions
- Testing private methods

### Slow Tests
- Unnecessary I/O operations
- Missing mocks for external calls
- Large test data sets

### Unclear Tests
- Generic test names
- Complex setup hiding intent
- Multiple concepts in one test

### Redundant Tests
- Duplicate coverage
- Testing framework behavior
- Testing trivial code

---

## Improvement Actions

### Quick Wins
- Fix flaky tests
- Add missing assertions
- Improve test names
- Remove dead tests

### Medium Effort
- Refactor complex setup
- Add missing edge cases
- Improve mock strategy

### Long Term
- Restructure test organization
- Implement missing test types
- Establish testing standards

---

## Next Steps

After test review:
- Address identified issues
- `*trace` - Verify requirement coverage
- Schedule regular reviews

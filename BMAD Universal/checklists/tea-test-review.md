# TEA Test Review Checklist

> **Purpose**: Comprehensive review of test code quality, coverage, and effectiveness.

---

## Code Quality Review

### Naming Conventions
- [ ] Test names describe behavior
- [ ] File names follow conventions
- [ ] Variable names are meaningful
- [ ] Constants named appropriately

### Structure
- [ ] Tests organized logically
- [ ] Proper use of describe blocks
- [ ] Setup/teardown appropriate
- [ ] Shared code extracted

### Readability
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] Consistent formatting
- [ ] No unnecessary complexity

---

## Test Implementation

### Independence
- [ ] Tests can run in isolation
- [ ] No shared mutable state
- [ ] No order dependencies
- [ ] Proper cleanup after each test

### Assertions
- [ ] Meaningful assertions present
- [ ] Single concept per test
- [ ] Expected vs actual clear
- [ ] Error messages helpful

### Data Management
- [ ] No hardcoded test data
- [ ] Factories used for data creation
- [ ] Data cleanup implemented
- [ ] Sensitive data handled properly

---

## Selector Quality

- [ ] Prefers `data-testid` attributes
- [ ] Uses ARIA roles appropriately
- [ ] Avoids brittle CSS selectors
- [ ] Selectors are documented
- [ ] No XPath unless necessary
- [ ] Selectors centralized (Page Objects)

---

## Waiting Strategies

- [ ] No arbitrary waits (waitForTimeout)
- [ ] Network-first patterns used
- [ ] Proper auto-waiting leveraged
- [ ] Explicit waits have justification
- [ ] Timeouts configured appropriately

---

## Error Handling

- [ ] Errors not swallowed
- [ ] Meaningful error messages
- [ ] Debug information captured
- [ ] Failure screenshots configured
- [ ] Traces enabled for debugging

---

## Coverage Analysis

### Requirement Coverage
- [ ] All acceptance criteria covered
- [ ] Happy paths tested
- [ ] Error scenarios tested
- [ ] Edge cases considered

### Code Coverage
| Area | Target | Actual |
|------|--------|--------|
| Critical paths | 100% | |
| Standard features | 80% | |
| Edge cases | 60% | |

### Gap Analysis
- [ ] Untested areas identified
- [ ] Risk of gaps assessed
- [ ] Gaps documented with justification

---

## Performance Review

### Execution Time
- [ ] Individual tests reasonable (< 30s)
- [ ] Suite completes in time budget
- [ ] No unnecessarily slow tests
- [ ] Parallelization supported

### Resource Usage
- [ ] No memory leaks in tests
- [ ] Proper cleanup of resources
- [ ] Efficient data setup

---

## Maintainability

### DRY Principle
- [ ] No duplicate code
- [ ] Shared utilities extracted
- [ ] Page objects used
- [ ] Fixtures properly utilized

### Flexibility
- [ ] Tests adapt to environment
- [ ] Configuration externalized
- [ ] Easy to update when UI changes

---

## Documentation

- [ ] Test purpose clear
- [ ] Complex tests documented
- [ ] Setup requirements noted
- [ ] Known limitations listed

---

## Stability Assessment

### Flakiness Check
- [ ] No known flaky tests
- [ ] Tests run multiple times successfully
- [ ] CI history reviewed
- [ ] Timing issues addressed

### Environment Independence
- [ ] Works across browsers
- [ ] Works in CI environment
- [ ] No machine-specific paths
- [ ] Timezone independent

---

## Review Findings

### Issues Found
| Issue | Severity | Location | Action |
|-------|----------|----------|--------|
| | | | |
| | | | |

### Recommendations
1. 
2. 
3. 

---

## Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Pass rate | > 99% | | |
| Flaky rate | < 1% | | |
| Coverage | > 80% | | |
| Avg duration | < 30s | | |

---

## Sign-off

| Review Area | Reviewer | Date | Status |
|-------------|----------|------|--------|
| Code quality | | | |
| Coverage | | | |
| Stability | | | |
| Documentation | | | |

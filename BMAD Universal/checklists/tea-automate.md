# TEA Automate Checklist

> **Purpose**: Ensure test automation implementation follows best practices and quality standards.

---

## Pre-Implementation

- [ ] Test design approved
- [ ] Automation scope confirmed
- [ ] Page objects/selectors identified
- [ ] Test data strategy defined
- [ ] Environment access verified

---

## Test Structure

### File Organization
- [ ] Tests organized by feature/domain
- [ ] Consistent naming conventions
- [ ] Proper file placement
- [ ] Shared utilities extracted

### Test Independence
- [ ] Each test can run in isolation
- [ ] No shared mutable state
- [ ] Proper setup/teardown
- [ ] No test order dependencies

### Test Clarity
- [ ] Descriptive test names
- [ ] Clear assertion messages
- [ ] Single responsibility per test
- [ ] Comments for complex logic

---

## Implementation Quality

### Selector Strategy
- [ ] `data-testid` used where possible
- [ ] ARIA roles for accessibility
- [ ] Fallback selectors documented
- [ ] No brittle CSS selectors

### Waiting Strategy
- [ ] Network-first patterns used
- [ ] No arbitrary waits
- [ ] Proper auto-waiting leveraged
- [ ] Explicit waits for edge cases

### Assertions
- [ ] Meaningful assertions
- [ ] Proper timeout configurations
- [ ] Soft assertions where appropriate
- [ ] Error messages helpful

---

## Page Objects / Components

- [ ] Page objects created for complex pages
- [ ] Methods abstract UI interactions
- [ ] Locators centralized
- [ ] Reusable components extracted
- [ ] Consistent patterns followed

---

## Test Data

### Data Management
- [ ] Factory methods for data creation
- [ ] API-based seeding preferred
- [ ] Cleanup hooks implemented
- [ ] No hardcoded test data

### Fixtures
- [ ] Playwright fixtures utilized
- [ ] Proper scope (test/worker)
- [ ] Cleanup in fixtures
- [ ] Fixture composition used

---

## Error Handling

- [ ] Meaningful error messages
- [ ] Proper try/catch where needed
- [ ] No swallowed errors
- [ ] Debug information captured

---

## Debugging Support

- [ ] Screenshots on failure
- [ ] Video capture configured
- [ ] Trace capture enabled
- [ ] Console logs captured
- [ ] Network logs available

---

## Code Review Checklist

### General
- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments without tickets

### Tests
- [ ] Tests actually test something
- [ ] Assertions are meaningful
- [ ] No false positives possible
- [ ] Edge cases considered

### Performance
- [ ] Tests complete in reasonable time
- [ ] No unnecessary waits
- [ ] Efficient selector strategies
- [ ] Proper parallelization support

---

## Execution Verification

- [ ] Tests pass locally
- [ ] Tests pass in CI
- [ ] Tests pass in parallel
- [ ] No flaky behavior observed
- [ ] Reports generate correctly

---

## Documentation

- [ ] Test purpose documented
- [ ] Complex logic explained
- [ ] Setup requirements noted
- [ ] Known limitations listed

---

## Quality Gates

| Metric | Target | Actual |
|--------|--------|--------|
| Test coverage | 80%+ | |
| Execution time | < 10min | |
| Flaky rate | < 1% | |
| Pass rate | > 99% | |

---

## Sign-off

| Review | Reviewer | Date |
|--------|----------|------|
| Code review | | |
| Execution verification | | |
| Documentation review | | |

# TEA ATDD (Acceptance Test Driven Development) Checklist

> **Purpose**: Guide acceptance test driven development workflow from requirements to automated tests.

---

## Requirements Collaboration

### Three Amigos Session
- [ ] Product owner present
- [ ] Developer(s) present
- [ ] QA/Test engineer present
- [ ] User story discussed and understood
- [ ] Questions and edge cases explored
- [ ] Examples documented

### Acceptance Criteria
- [ ] Written in Given/When/Then format
- [ ] Clear and unambiguous
- [ ] Testable and measurable
- [ ] Covers happy path
- [ ] Covers error scenarios
- [ ] Includes boundary conditions

---

## Example Mapping

### Positive Examples
- [ ] Main success scenario
- [ ] Alternate success paths
- [ ] Different user roles
- [ ] Various data states

### Negative Examples
- [ ] Invalid input handling
- [ ] Authorization failures
- [ ] Business rule violations
- [ ] System unavailability

### Edge Cases
- [ ] Boundary values
- [ ] Concurrent operations
- [ ] Timing edge cases
- [ ] Data extremes

---

## Test Specification

### Feature File (if using BDD)
```gherkin
Feature: [Feature Name]
  As a [role]
  I want [capability]
  So that [benefit]

  Scenario: [Scenario Name]
    Given [precondition]
    And [additional precondition]
    When [action]
    Then [expected result]
    And [additional result]
```

### Test Cases
- [ ] One test per acceptance criterion
- [ ] Clear test names describing behavior
- [ ] Independent tests
- [ ] Appropriate test data

---

## Implementation Workflow

### Before Coding
- [ ] Acceptance tests written
- [ ] Tests fail (Red phase)
- [ ] Implementation approach agreed
- [ ] Dependencies identified

### During Development
- [ ] Tests guide implementation
- [ ] Incremental progress validated
- [ ] Tests updated as understanding evolves
- [ ] Edge cases addressed

### After Implementation
- [ ] All acceptance tests pass (Green)
- [ ] Code refactored as needed
- [ ] Tests remain green
- [ ] Coverage verified

---

## Test Quality

### Readability
- [ ] Tests serve as documentation
- [ ] Business language used
- [ ] Non-technical stakeholders can understand
- [ ] Intent clear from test names

### Maintainability
- [ ] No duplication
- [ ] Shared steps/fixtures used
- [ ] Page objects abstract UI details
- [ ] Data factories for test data

### Reliability
- [ ] No flaky tests
- [ ] Deterministic results
- [ ] Independent execution
- [ ] Proper cleanup

---

## Collaboration Artifacts

### Living Documentation
- [ ] Tests serve as specification
- [ ] Kept up to date
- [ ] Accessible to stakeholders
- [ ] Versioned with code

### Reports
- [ ] Readable by non-technical team
- [ ] Show feature coverage
- [ ] Highlight failures clearly
- [ ] Provide debugging information

---

## Review Points

### Story Kickoff
- [ ] Acceptance criteria reviewed
- [ ] Examples agreed upon
- [ ] Test approach confirmed
- [ ] Dependencies identified

### Implementation Review
- [ ] Tests match acceptance criteria
- [ ] Edge cases covered
- [ ] Implementation complete
- [ ] All tests passing

### Story Sign-off
- [ ] Product owner reviews tests
- [ ] Tests demonstrate requirements met
- [ ] Documentation updated
- [ ] Story accepted

---

## Metrics

| Metric | Target |
|--------|--------|
| AC to test coverage | 100% |
| Test creation before code | > 80% |
| Flaky test rate | < 1% |
| Test review participation | 100% |

---

## Anti-Patterns to Avoid

- [ ] Writing tests after implementation
- [ ] Technical language in acceptance tests
- [ ] Testing implementation not behavior
- [ ] Skipping the collaboration session
- [ ] Over-specifying UI details
- [ ] Ignoring edge cases

---

## Sign-off

| Stage | Reviewer | Date |
|-------|----------|------|
| AC Review | | |
| Test Specification | | |
| Implementation | | |
| Story Acceptance | | |

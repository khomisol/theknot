# Test Design: [Feature/Story Name]

## Overview
**Story Reference:** [Story ID]
**Author:** [Name]
**Date:** [Date]
**Status:** Draft / Review / Approved

---

## Scope

### In Scope
- [What will be tested]

### Out of Scope
- [What will NOT be tested]

### Test Levels
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] API Tests

---

## Risk Assessment

| Area | Risk Level | Coverage Depth |
|------|------------|----------------|
| [Area 1] | High | Thorough |
| [Area 2] | Medium | Standard |
| [Area 3] | Low | Basic |

---

## Test Scenarios

### Scenario 1: [Happy Path - Primary Flow]

**Preconditions:**
- [Precondition 1]
- [Precondition 2]

**Test Cases:**

| ID | Description | Input | Expected | Priority |
|----|-------------|-------|----------|----------|
| TC-001 | [Description] | [Input] | [Expected] | P0 |
| TC-002 | [Description] | [Input] | [Expected] | P0 |

---

### Scenario 2: [Error Handling]

**Preconditions:**
- [Precondition]

**Test Cases:**

| ID | Description | Input | Expected | Priority |
|----|-------------|-------|----------|----------|
| TC-003 | Invalid input handling | [Invalid] | Error message | P1 |
| TC-004 | Network failure | Timeout | Graceful error | P1 |

---

### Scenario 3: [Edge Cases]

| ID | Description | Input | Expected | Priority |
|----|-------------|-------|----------|----------|
| TC-005 | Empty input | "" | [Behavior] | P2 |
| TC-006 | Max length | [Max] | [Behavior] | P2 |
| TC-007 | Special characters | [Special] | [Behavior] | P2 |

---

### Scenario 4: [Boundary Conditions]

| ID | Description | Input | Expected | Priority |
|----|-------------|-------|----------|----------|
| TC-008 | Minimum value | [Min] | [Behavior] | P1 |
| TC-009 | Maximum value | [Max] | [Behavior] | P1 |
| TC-010 | Just below max | [Max-1] | [Behavior] | P2 |

---

## Test Data Requirements

| Data Type | Source | Notes |
|-----------|--------|-------|
| Users | Factory | Use createUser() |
| Products | Factory | Use createProduct() |
| Config | Env vars | TEST_ENV |

---

## Automation Notes

### Recommended Framework
- [ ] Playwright
- [ ] Jest/Vitest
- [ ] Cypress

### Test Tags
```
@smoke - Critical path tests
@regression - Full regression suite
@[feature] - Feature-specific tests
```

### Fixtures Needed
- [ ] Auth fixture (login state)
- [ ] Data fixture (seed data)
- [ ] Network fixture (API mocks)

---

## Traceability

| Acceptance Criteria | Test Cases |
|---------------------|------------|
| AC-1: [Criterion] | TC-001, TC-002 |
| AC-2: [Criterion] | TC-003, TC-004 |

---

## Sign-off

- [ ] Test design reviewed
- [ ] Coverage sufficient for risk level
- [ ] Automation feasible
- [ ] Test data available

# Workflow: Test Design (TD)

## Purpose
Create comprehensive test specifications and test cases for features and components.

## Agent
Test Architect (TEA) - Tessa

## Command
`*test-design` or `*test-design [feature/story]`

---

## Prerequisites

- Feature/story defined
- Acceptance criteria available
- Test framework established

---

## Process

### Step 1: Understand Scope

**Load relevant context:**
- Story/feature specification
- Acceptance criteria
- Related architecture

**Ask if unclear:**
- What feature/component are we testing?
- What are the key scenarios?
- Any specific edge cases?

### Step 2: Identify Test Scenarios

**For each acceptance criterion:**

1. **Happy Path** - Normal expected behavior
2. **Boundary Conditions** - Limits, edges
3. **Error Cases** - Invalid inputs, failures
4. **Edge Cases** - Unusual but valid scenarios

**Scenario Template:**
```
Given [context/precondition]
When [action/trigger]
Then [expected outcome]
```

### Step 3: Define Test Cases

For each scenario, create test case:

```markdown
### TC-001: [Descriptive Name]

**Scenario:** [What is being tested]
**Type:** Unit | Integration | E2E
**Priority:** Critical | High | Medium | Low

**Preconditions:**
- [Required state/data]

**Steps:**
1. [Action]
2. [Action]
3. [Verify]

**Expected Result:**
- [Specific observable outcome]

**Test Data:**
- [Specific values needed]
```

### Step 4: Prioritize Tests

**Priority Matrix:**

| Impact | Frequency | Priority |
|--------|-----------|----------|
| High   | High      | Critical |
| High   | Low       | High     |
| Low    | High      | Medium   |
| Low    | Low       | Low      |

**Critical tests (always automate):**
- Authentication flows
- Payment processing
- Data integrity
- Security boundaries

### Step 5: Document Test Specification

Create in `docs/tests/` or with story:

```markdown
# Test Specification: [Feature Name]

## Overview
[What is being tested and why]

## Test Coverage Matrix
| Requirement | Test Cases | Status |
|-------------|------------|--------|
| AC-1        | TC-001,002 | Draft  |
| AC-2        | TC-003     | Draft  |

## Test Cases
[Detailed test cases]

## Test Data Requirements
[Data needed for tests]

## Environment Requirements
[Setup needed]
```

---

## Output

- Test specification document
- Prioritized test case list
- Test data requirements
- Coverage mapping to requirements

---

## Test Design Patterns

### Equivalence Partitioning
Group inputs that should behave the same:
- Valid range: 1-100 → test 50
- Below range: <1 → test 0, -1
- Above range: >100 → test 101, 1000

### Boundary Value Analysis
Test at boundaries:
- Min, min-1, min+1
- Max, max-1, max+1

### State Transition
Test state changes:
- Draft → Published → Archived
- Each valid transition
- Invalid transitions (should fail)

### Decision Table
Complex logic with multiple conditions:
| Cond A | Cond B | Cond C | Result |
|--------|--------|--------|--------|
| T      | T      | T      | X      |
| T      | T      | F      | Y      |
| ...    | ...    | ...    | ...    |

---

## Next Steps

After test design:
- `*automate` - Implement automated tests
- `*trace` - Trace tests to requirements

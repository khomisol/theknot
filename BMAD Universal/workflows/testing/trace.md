# Workflow: Requirements Traceability (TR)

## Purpose
Establish and maintain traceability between requirements, tests, and implementation.

## Agent
Test Architect (TEA) - Tessa

## Command
`*trace`

---

## Prerequisites

- Requirements documented (PRD, stories)
- Tests implemented or designed
- Architecture documentation

---

## Traceability Matrix

```
Requirements ←→ Design ←→ Implementation ←→ Tests
     │            │            │              │
     └────────────┴────────────┴──────────────┘
                  Bidirectional Tracing
```

---

## Process

### Step 1: Identify Traceability Scope

**Determine what to trace:**
- Business requirements → Technical specs
- User stories → Test cases
- Acceptance criteria → Automated tests
- Architecture decisions → Implementation

### Step 2: Establish Requirement IDs

**Ensure consistent identification:**
```
REQ-001: User authentication
  AC-001-1: Valid login succeeds
  AC-001-2: Invalid credentials rejected
  AC-001-3: Account lockout after failures

REQ-002: Data export
  AC-002-1: Export to CSV
  AC-002-2: Export to PDF
```

### Step 3: Map Tests to Requirements

**Create traceability matrix:**

```markdown
# Traceability Matrix

## Requirements to Tests

| Req ID | Requirement | Test IDs | Coverage |
|--------|-------------|----------|----------|
| REQ-001 | User authentication | TC-001, TC-002, TC-003 | Full |
| AC-001-1 | Valid login | TC-001, E2E-001 | Full |
| AC-001-2 | Invalid credentials | TC-002 | Full |
| AC-001-3 | Account lockout | TC-003 | Full |
| REQ-002 | Data export | TC-010, TC-011 | Partial |
| AC-002-1 | CSV export | TC-010 | Full |
| AC-002-2 | PDF export | - | None ⚠️ |

## Tests to Requirements

| Test ID | Test Name | Requirement |
|---------|-----------|-------------|
| TC-001 | Login success | REQ-001, AC-001-1 |
| TC-002 | Login failure | REQ-001, AC-001-2 |
| TC-003 | Account lockout | REQ-001, AC-001-3 |
| E2E-001 | Complete login flow | REQ-001 |
```

### Step 4: Identify Gaps

**Coverage analysis:**

```markdown
## Coverage Summary

### Fully Covered
- REQ-001: User authentication (3/3 AC)

### Partially Covered
- REQ-002: Data export (1/2 AC)
  - Missing: AC-002-2 (PDF export)

### Not Covered
- REQ-003: User preferences (0/2 AC)
  - Missing: AC-003-1, AC-003-2

## Gap Analysis
| Gap | Impact | Priority | Action |
|-----|--------|----------|--------|
| AC-002-2 | Medium | High | Design PDF export tests |
| REQ-003 | High | Critical | Full test coverage needed |
```

### Step 5: Maintain Traceability

**In test files, add requirement references:**

```typescript
/**
 * @requirement REQ-001
 * @acceptance AC-001-1
 */
describe('User Login', () => {
  it('allows login with valid credentials', () => {
    // Test implementation
  });
});
```

**Or use tags:**
```gherkin
@REQ-001 @AC-001-1
Scenario: Successful login with valid credentials
  Given I am on the login page
  When I enter valid credentials
  Then I should be logged in
```

---

## Output

- Traceability matrix document
- Coverage analysis
- Gap identification
- Test-to-requirement mapping

---

## Traceability Document Template

```markdown
# Requirements Traceability Matrix

## Document Info
- Project: [Name]
- Version: [X.Y]
- Last Updated: [Date]

## Scope
[What is traced and what is out of scope]

## Requirements Summary
| Category | Total | Tested | Coverage |
|----------|-------|--------|----------|
| Functional | X | Y | Z% |
| Non-Functional | X | Y | Z% |

## Detailed Traceability
[Matrix tables as shown above]

## Gap Analysis
[Identified gaps and action items]

## Change Log
| Date | Change | Impact |
|------|--------|--------|
```

---

## Automation Options

### Test Management Tools
- **TestRail** - Test case management
- **Xray** - Jira integration
- **Zephyr** - Test management
- **qTest** - Enterprise test management

### Code-Based Tracing
```typescript
// Custom decorator for tracing
function requirement(reqId: string) {
  return function (target: any, key: string) {
    Reflect.defineMetadata('requirement', reqId, target, key);
  };
}

@requirement('REQ-001')
it('should validate user login', () => {
  // test
});
```

### Generate Reports
```bash
# Custom script to extract requirement tags
grep -r "@requirement" tests/ | \
  awk '{print $2}' | \
  sort | uniq -c > coverage-report.txt
```

---

## Best Practices

1. **Single source of truth** - One location for matrix
2. **Bidirectional links** - Trace both directions
3. **Regular updates** - Update with each change
4. **Automation** - Automate where possible
5. **Review gaps** - Regular gap analysis
6. **Version control** - Track matrix changes

---

## Next Steps

After traceability setup:
- Address coverage gaps
- Automate trace generation
- Establish update process
- `*test-review` - Regular coverage reviews

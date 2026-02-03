# TEA Traceability Checklist

> **Purpose**: Ensure complete traceability from requirements through test implementation and results.

---

## Requirements Tracing

### Source Documentation
- [ ] Requirements documented
- [ ] User stories identified
- [ ] Acceptance criteria defined
- [ ] Non-functional requirements listed

### Requirement IDs
- [ ] Unique IDs assigned to requirements
- [ ] IDs used consistently
- [ ] IDs traceable to source system
- [ ] Changes tracked with IDs

---

## Test Case Mapping

### Coverage Matrix
- [ ] All requirements have tests
- [ ] Test IDs linked to requirement IDs
- [ ] Coverage gaps identified
- [ ] Justification for gaps documented

### Mapping Format
```
Requirement ID | Test File | Test Name | Priority
REQ-001 | auth.spec.ts | user can login | P0
REQ-002 | checkout.spec.ts | complete purchase | P0
```

### Bidirectional Tracing
- [ ] Requirements → Tests (forward)
- [ ] Tests → Requirements (backward)
- [ ] Easy to find all tests for a requirement
- [ ] Easy to find requirement for any test

---

## Test Tagging

### In Test Code
```typescript
test('user can login @REQ-001 @P0', async ({ page }) => {
  // Implementation
});
```

### Tag Categories
- [ ] Requirement IDs (`@REQ-xxx`)
- [ ] Priority levels (`@P0-P3`)
- [ ] Feature areas (`@auth`, `@checkout`)
- [ ] Test types (`@smoke`, `@regression`)

---

## Coverage Verification

### Automated Checks
- [ ] Script to generate coverage report
- [ ] Unmapped requirements flagged
- [ ] Orphan tests identified
- [ ] Report generated in CI

### Manual Review
- [ ] Coverage reviewed each sprint
- [ ] Gaps discussed in planning
- [ ] New requirements immediately mapped
- [ ] Removed requirements cleaned up

---

## Change Management

### When Requirements Change
- [ ] Affected tests identified
- [ ] Tests updated or created
- [ ] Traceability matrix updated
- [ ] Regression tests verified

### When Tests Change
- [ ] Requirement linkage maintained
- [ ] Coverage impact assessed
- [ ] Matrix updated
- [ ] Stakeholders notified if needed

---

## Reporting

### Coverage Report
- [ ] Percentage coverage by area
- [ ] List of unmapped requirements
- [ ] List of unmapped tests
- [ ] Trend over time

### Test Results Mapping
- [ ] Results linked to requirements
- [ ] Failed tests show requirement impact
- [ ] Easy to see requirement status
- [ ] Stakeholder-friendly reports

---

## Traceability Matrix Template

### Requirements to Tests

| Req ID | Description | Test File(s) | Test Count | Status |
|--------|-------------|--------------|------------|--------|
| REQ-001 | User login | auth.spec.ts | 5 | ✅ |
| REQ-002 | Checkout | checkout.spec.ts | 12 | ✅ |
| REQ-003 | Search | search.spec.ts | 8 | ✅ |

### Tests to Requirements

| Test File | Test Name | Req IDs | Priority |
|-----------|-----------|---------|----------|
| auth.spec.ts | login with email | REQ-001 | P0 |
| auth.spec.ts | login with SSO | REQ-001 | P1 |

---

## Coverage Gaps

### Documented Gaps

| Req ID | Reason for Gap | Risk | Mitigation |
|--------|----------------|------|------------|
| | | | |

### Acceptance Criteria
- [ ] 100% P0 requirements covered
- [ ] > 90% P1 requirements covered
- [ ] > 80% P2 requirements covered
- [ ] All gaps documented and justified

---

## Tools & Automation

### Recommended Approach
- [ ] Test tags for requirement IDs
- [ ] Script to extract traceability
- [ ] CI job to verify coverage
- [ ] Dashboard for visibility

### Example Script
```bash
# Extract requirement coverage
grep -r "@REQ-" tests/ | \
  awk -F'@REQ-' '{print $2}' | \
  sort | uniq -c | \
  sort -rn
```

---

## Review Process

### Sprint Review
- [ ] New requirements mapped
- [ ] Removed requirements cleaned up
- [ ] Coverage report generated
- [ ] Gaps addressed or documented

### Release Review
- [ ] Full traceability audit
- [ ] All requirements verified
- [ ] Gap risk assessment
- [ ] Sign-off obtained

---

## Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Requirement coverage | 95% | |
| Mapped tests | 100% | |
| Gap documentation | 100% | |

---

## Sign-off

| Review Item | Reviewer | Date |
|-------------|----------|------|
| Coverage matrix | | |
| Gap justification | | |
| Traceability tooling | | |

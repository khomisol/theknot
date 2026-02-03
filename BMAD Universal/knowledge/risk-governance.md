# Risk Governance and Quality Gates

## Principle

Risk governance transforms subjective "should we ship?" debates into objective, data-driven decisions. By scoring risk (probability × impact), classifying by category, and tracking mitigation ownership, teams create transparent quality gates.

---

## Why This Matters

Without formal risk governance:
- Releases become political (loud voices win, quiet risks hide)
- Critical issues discovered in production
- "We thought it was fine" isn't a release strategy

Risk scoring creates shared language:
- Scores ≥6 demand documented mitigation
- Score = 9 mandates gate failure
- Every acceptance criterion maps to a test

---

## Risk Scoring Matrix

**Formula:** Risk Score = Probability × Impact

| Probability | Impact | Score | Level |
|-------------|--------|-------|-------|
| 3 (High) | 3 (High) | 9 | CRITICAL - Blocker |
| 3 (High) | 2 (Med) | 6 | HIGH - Requires mitigation |
| 2 (Med) | 3 (High) | 6 | HIGH - Requires mitigation |
| 2 (Med) | 2 (Med) | 4 | MEDIUM - Monitor |
| 1 (Low) | Any | 1-3 | LOW - Accept |

---

## Risk Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **TECH** | Technical debt, architecture | Fragile code, missing tests |
| **SEC** | Security vulnerabilities | SQL injection, auth bypass |
| **PERF** | Performance degradation | Slow queries, memory leaks |
| **DATA** | Data integrity | Corruption, loss, inconsistency |
| **BUS** | Business logic errors | Wrong calculations, bad flows |
| **OPS** | Operational issues | Deploy failures, monitoring gaps |

---

## Gate Decision Logic

```
IF any score = 9 AND status = OPEN
  → FAIL (Critical blockers)

IF any coverage gaps exist (acceptance criteria without tests)
  → FAIL (Missing coverage)

IF all risks waived by authorized approver
  → WAIVED (Explicit acceptance)

IF high risks (6-8) exist with mitigation plans
  → CONCERNS (Proceed with monitoring)

IF all risks low or mitigated
  → PASS (Ready for release)
```

---

## Risk Assessment Template

```markdown
## Risk: [Title]

**ID:** RISK-001
**Category:** SEC / TECH / PERF / DATA / BUS / OPS
**Status:** OPEN / MITIGATED / WAIVED / ACCEPTED

**Scoring:**
- Probability: [1-3] - [Low/Medium/High]
- Impact: [1-3] - [Low/Medium/High]
- **Score: [1-9]**

**Description:**
[What is the risk and why does it matter?]

**Owner:** [name@email.com]
**Deadline:** [YYYY-MM-DD]

**Mitigation Plan:**
1. [Action item 1]
2. [Action item 2]

**Waiver (if applicable):**
- Reason: [Why is this acceptable?]
- Approver: [Authority who approved]
- Expiry: [When waiver expires]
```

---

## Coverage Traceability

Every acceptance criterion must map to at least one test:

```markdown
| Story | Acceptance Criterion | Test File | Status |
|-------|---------------------|-----------|--------|
| US-123 | User can login | e2e/auth/login.spec.ts | ✅ Covered |
| US-123 | Error on invalid password | e2e/auth/login.spec.ts | ✅ Covered |
| US-124 | Password reset email | - | ❌ GAP |
```

**Gap Resolution:**
- Write missing test
- Document waiver with reason
- Accept risk with owner assignment

---

## Quality Gate Checklist

Before release:

- [ ] All risks scored (Probability × Impact)
- [ ] Every risk >4 has owner, plan, deadline
- [ ] Every acceptance criterion has test
- [ ] Gate decision documented (PASS/CONCERNS/FAIL/WAIVED)
- [ ] Waivers have approver, reason, expiry
- [ ] No score=9 risks in OPEN status
- [ ] Traceability matrix up to date

---

## Related Knowledge

- `probability-impact.md` - Scoring definitions
- `test-priorities.md` - P0-P3 classification
- `nfr-criteria.md` - Non-functional requirements

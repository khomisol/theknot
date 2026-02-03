# Probability-Impact Risk Matrix

> **Purpose**: Framework for scoring and prioritizing tests based on probability of failure and impact of that failure.

---

## Risk Scoring Formula

```
Risk Score = Probability × Impact
```

Where:
- **Probability**: Likelihood of the feature failing (1-3)
- **Impact**: Business/user impact if it fails (1-3)
- **Score**: 1-9 (higher = higher priority)

---

## Probability Scale

| Score | Level | Description | Indicators |
|-------|-------|-------------|------------|
| 1 | Low | Rarely fails | Stable code, well-tested, simple logic |
| 2 | Medium | Occasional failures | Complex logic, external dependencies |
| 3 | High | Frequently fails | New code, frequent changes, flaky history |

### Factors Increasing Probability

- Recent code changes
- Complex business logic
- External service dependencies
- Third-party integrations
- Concurrent operations
- Data migrations
- New team members working on area

---

## Impact Scale

| Score | Level | Description | Examples |
|-------|-------|-------------|----------|
| 1 | Low | Minor inconvenience | Cosmetic issues, tooltips |
| 2 | Medium | Significant UX degradation | Feature unavailable, errors shown |
| 3 | High | Critical business impact | Can't checkout, data loss, security breach |

### Factors Increasing Impact

- Revenue-generating features
- User data handling
- Security/authentication
- Core user journeys
- No workaround available
- Affects all users

---

## Risk Matrix

```
              IMPACT
           Low(1)  Med(2)  High(3)
         ┌───────┬───────┬───────┐
   High  │   3   │   6   │   9   │  ← P0 Tests
    (3)  │  P2   │  P1   │  P0   │
P        ├───────┼───────┼───────┤
R  Med   │   2   │   4   │   6   │  ← P1 Tests
O   (2)  │  P3   │  P2   │  P1   │
B        ├───────┼───────┼───────┤
   Low   │   1   │   2   │   3   │  ← P2/P3 Tests
    (1)  │  P3   │  P3   │  P2   │
         └───────┴───────┴───────┘
```

---

## Priority Mapping

| Score | Priority | Testing Strategy |
|-------|----------|------------------|
| 7-9 | P0 | Every commit, zero tolerance for flakiness |
| 5-6 | P1 | Every PR, high stability requirement |
| 3-4 | P2 | Daily/nightly, monitor trends |
| 1-2 | P3 | Weekly/release, may skip if needed |

---

## Scoring Examples

### Example 1: Checkout Payment

| Factor | Score | Justification |
|--------|-------|---------------|
| Probability | 2 | Third-party payment integration |
| Impact | 3 | Blocks revenue, all customers |
| **Total** | **6** | **P1 - High Priority** |

### Example 2: User Avatar Upload

| Factor | Score | Justification |
|--------|-------|---------------|
| Probability | 2 | File handling, storage |
| Impact | 1 | Cosmetic, easy workaround |
| **Total** | **2** | **P3 - Low Priority** |

### Example 3: Login Authentication

| Factor | Score | Justification |
|--------|-------|---------------|
| Probability | 1 | Stable, well-tested |
| Impact | 3 | Blocks all access |
| **Total** | **3** | **P2** (upgrade to P0 due to criticality) |

### Example 4: New Feature (Recently Deployed)

| Factor | Score | Justification |
|--------|-------|---------------|
| Probability | 3 | New code, untested in production |
| Impact | 2 | Significant but not critical |
| **Total** | **6** | **P1 - High Priority** |

---

## Implementation

### Tagging with Scores

```typescript
// Include risk score in test tags
test('checkout payment @P1 @risk:6 @prob:2 @impact:3', async ({ page }) => {
  // Test implementation
});

test('avatar upload @P3 @risk:2 @prob:2 @impact:1', async ({ page }) => {
  // Test implementation
});
```

### Dynamic Priority Calculation

```typescript
// fixtures/risk-priority.fixture.ts
interface RiskAssessment {
  probability: 1 | 2 | 3;
  impact: 1 | 2 | 3;
}

function calculatePriority(risk: RiskAssessment): 'P0' | 'P1' | 'P2' | 'P3' {
  const score = risk.probability * risk.impact;
  
  if (score >= 7) return 'P0';
  if (score >= 5) return 'P1';
  if (score >= 3) return 'P2';
  return 'P3';
}

// Usage in test organization
const checkoutRisk: RiskAssessment = { probability: 2, impact: 3 };
const priority = calculatePriority(checkoutRisk); // 'P1'
```

### Risk Register

```typescript
// risk-register.ts
interface FeatureRisk {
  feature: string;
  probability: 1 | 2 | 3;
  impact: 1 | 2 | 3;
  score: number;
  priority: string;
  lastReview: string;
  notes: string;
}

const riskRegister: FeatureRisk[] = [
  {
    feature: 'checkout',
    probability: 2,
    impact: 3,
    score: 6,
    priority: 'P1',
    lastReview: '2024-01-15',
    notes: 'Third-party payment provider',
  },
  {
    feature: 'login',
    probability: 1,
    impact: 3,
    score: 3,
    priority: 'P0',  // Override: critical path
    lastReview: '2024-01-15',
    notes: 'Elevated due to criticality',
  },
  // ...
];
```

---

## Gate Decisions

### Deployment Gates

| Score | Gate Decision |
|-------|---------------|
| 9 | Block deploy, immediate fix required |
| 6-8 | Block deploy, fix before next release |
| 4-5 | Warning, fix within sprint |
| 1-3 | Log for backlog, monitor |

### Test Failure Response

```typescript
// In CI configuration
const CRITICAL_THRESHOLD = 7;
const HIGH_THRESHOLD = 5;

function handleTestFailure(test: TestResult) {
  const riskScore = getRiskScore(test);
  
  if (riskScore >= CRITICAL_THRESHOLD) {
    // Immediate action required
    blockDeploy();
    notifyOncall();
  } else if (riskScore >= HIGH_THRESHOLD) {
    // Review before proceeding
    requireApproval();
  } else {
    // Log and continue
    logForReview(test);
  }
}
```

---

## Risk Adjustment Factors

### Probability Adjustments

```typescript
function adjustProbability(base: number, factors: ProbabilityFactors): number {
  let adjusted = base;
  
  // Increase probability
  if (factors.recentChanges) adjusted += 0.5;
  if (factors.newDependency) adjusted += 0.5;
  if (factors.historyOfFlakiness) adjusted += 1;
  if (factors.complexLogic) adjusted += 0.5;
  
  // Decrease probability
  if (factors.wellTested) adjusted -= 0.5;
  if (factors.stableCode) adjusted -= 0.5;
  
  return Math.min(3, Math.max(1, Math.round(adjusted)));
}
```

### Impact Adjustments

```typescript
function adjustImpact(base: number, factors: ImpactFactors): number {
  let adjusted = base;
  
  // Increase impact
  if (factors.revenueRelated) adjusted += 1;
  if (factors.noWorkaround) adjusted += 0.5;
  if (factors.securityRelated) adjusted += 1;
  if (factors.affectsAllUsers) adjusted += 0.5;
  
  // Decrease impact
  if (factors.hasWorkaround) adjusted -= 0.5;
  if (factors.lowUsage) adjusted -= 0.5;
  
  return Math.min(3, Math.max(1, Math.round(adjusted)));
}
```

---

## Review Process

### When to Re-assess

- After production incidents
- After major code changes
- Quarterly review cycle
- When adding new features
- When deprecating features

### Review Template

```markdown
## Risk Assessment Review

**Feature**: Checkout Flow
**Date**: 2024-01-15
**Reviewer**: @testlead

### Current Assessment
- Probability: 2 (Medium)
- Impact: 3 (High)
- Score: 6
- Priority: P1

### Changes Since Last Review
- Added new payment provider
- Refactored cart logic

### Updated Assessment
- Probability: 3 (High) - New integration, untested
- Impact: 3 (High) - No change
- Score: 9
- Priority: P0 (temporary elevation)

### Action Items
- [ ] Add integration tests for new provider
- [ ] Monitor for 2 weeks post-deployment
- [ ] Re-assess after stabilization
```

---

## Visualization

### Risk Heatmap

```
Feature          Prob  Impact  Score  Priority
─────────────────────────────────────────────
Login            [1]   [███]   3      P0*
Checkout         [██]  [███]   6      P1
Search           [██]  [██]    4      P2
Avatar Upload    [██]  [█]     2      P3
Settings         [█]   [█]     1      P3
─────────────────────────────────────────────
█ = 1, ██ = 2, ███ = 3
* = Override
```

---

## Related Knowledge

- [Test Priorities Matrix](test-priorities-matrix.md) - Priority levels
- [NFR Criteria](nfr-criteria.md) - Non-functional requirements
- [Risk Governance](risk-governance.md) - Risk management

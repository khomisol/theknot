# Workflow: Sprint Status (SS)

## Purpose
Generate comprehensive sprint status report for stakeholder communication and team alignment.

## Agent
Scrum Master (SM) - Sally

## Command
`*sprint-status`

---

## Prerequisites

- Active sprint with defined stories
- Story status tracking available

---

## Process

### Step 1: Gather Sprint Data

**Collect from project documentation:**
- Sprint goal
- Committed stories and points
- Current status of each story
- Blockers and risks
- Team capacity/availability

### Step 2: Calculate Metrics

**Velocity tracking:**
```
Committed:    [X] story points
Completed:    [Y] story points  
In Progress:  [Z] story points
Remaining:    [W] story points
Completion:   [Y/X * 100]%
```

**Story status breakdown:**
- ✅ Done: [list]
- 🔄 In Progress: [list]
- 🔜 Not Started: [list]
- ⚠️ At Risk: [list]
- 🛑 Blocked: [list]

### Step 3: Assess Sprint Health

**Health indicators:**

| Indicator | Status | Notes |
|-----------|--------|-------|
| Sprint Goal | 🟢/🟡/🔴 | On track / At risk / Off track |
| Velocity | 🟢/🟡/🔴 | Ahead / On pace / Behind |
| Blockers | 🟢/🟡/🔴 | None / Manageable / Critical |
| Scope | 🟢/🟡/🔴 | Stable / Minor changes / Creep |

### Step 4: Identify Risks & Blockers

**For each blocker/risk:**
```markdown
### Blocker: [Title]
- **Impact:** [affected stories/goals]
- **Owner:** [responsible person]
- **Status:** [action being taken]
- **ETA:** [expected resolution]
```

### Step 5: Generate Report

---

## Sprint Status Report Template

```markdown
# Sprint Status Report
**Sprint:** [Sprint Name/Number]
**Date:** [Date]
**Days Remaining:** [X] of [Y]

## Sprint Goal
[Sprint goal statement]

### Goal Status: 🟢 On Track | 🟡 At Risk | 🔴 Off Track

---

## Metrics Summary

| Metric | Value |
|--------|-------|
| Committed Points | X |
| Completed Points | Y |
| Completion Rate | Z% |
| Stories Done | A/B |

## Burndown
[If tracking, show progress vs ideal]
```
Day 1: ████████████████████ 50pts
Day 5: ████████████        30pts (ideal: 25pts)
Day 10: ██████              15pts (ideal: 0pts)
```

---

## Story Status

### ✅ Completed
- [Story-1]: [Title] (Xpts)
- [Story-2]: [Title] (Ypts)

### 🔄 In Progress  
- [Story-3]: [Title] (Zpts) - [developer] - [% complete]
- [Story-4]: [Title] (Wpts) - [developer] - [% complete]

### 🔜 Not Started
- [Story-5]: [Title] (Vpts)

### ⚠️ At Risk
- [Story-6]: [Title] - [risk reason]

### 🛑 Blocked
- [Story-7]: [Title] - [blocker description]

---

## Blockers & Risks

### Active Blockers
1. **[Blocker Title]**
   - Impact: [description]
   - Owner: [name]
   - Action: [resolution steps]
   - ETA: [date]

### Identified Risks
1. **[Risk Title]**
   - Probability: High/Medium/Low
   - Impact: High/Medium/Low
   - Mitigation: [steps]

---

## Highlights
- [Key achievement or progress]
- [Important decision made]
- [Dependency resolved]

## Concerns
- [Issue requiring attention]
- [Resource constraint]
- [Technical challenge]

---

## Next Steps
1. [Priority action item]
2. [Priority action item]
3. [Priority action item]

## Need from Stakeholders
- [Decision needed]
- [Resource request]
- [Escalation item]
```

---

## Output

- Sprint status report
- Updated story statuses
- Blocker/risk register
- Action items

---

## Frequency

- **Daily:** Quick status (standup-style)
- **Mid-Sprint:** Detailed assessment
- **End of Sprint:** Final status + retrospective input

---

## Related Workflows

- `*sprint-planning` - Plan sprint work
- `*retrospective` - Sprint retrospective
- `*correct-course` - Mid-sprint adjustments

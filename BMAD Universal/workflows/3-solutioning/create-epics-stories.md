# Workflow: Create Epics and Stories

## Purpose
Transform PRD requirements into implementable epics and stories.

## Agent
Product Manager (John)

## Prerequisites
- PRD document complete
- Architecture document complete

---

## Process

### Step 1: Load Context

**Actions:**
1. Read PRD functional requirements
2. Read architecture document
3. Understand technical constraints
4. Note dependencies

---

### Step 2: Group into Epics

**For each major capability:**

```markdown
## Epic [N]: [Epic Name]

**Goal:** [What this epic achieves]

**User Value:** [Why users care]

**Dependencies:** [Other epics this depends on]
```

**Guidelines:**
- Group related features
- Each epic delivers user value
- Sequence by dependency
- Keep epics manageable (3-8 stories)

---

### Step 3: Break into Stories

**For each epic, create stories:**

```markdown
### Story [Epic].[Story]: [Story Name]

**User Story:**
As a [user], I want [goal] so that [benefit]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Technical Notes:**
[From architecture - relevant technical context]
```

**Guidelines:**
- Each story is independently valuable
- Stories are completable in 1-3 days
- Acceptance criteria are testable
- Include technical context from architecture

---

### Step 4: Sequence Stories

**Order by:**
1. Dependencies (blockers first)
2. Risk (high-risk early)
3. Value (high-value early)
4. Complexity (build up)

---

### Step 5: Document

**Create:** `docs/epics.md`

**Structure:**
```markdown
# Epics and Stories

## Overview
- Total Epics: [N]
- Total Stories: [N]
- Estimated Effort: [Range]

## Epic 1: [Name]
[Epic details]

### Story 1.1: [Name]
[Story details]

### Story 1.2: [Name]
[Story details]

## Epic 2: [Name]
...
```

---

## Output

- `docs/epics.md` - Complete epic and story breakdown
- Ready for sprint planning

---

## Next Steps

After epics/stories created:
1. Implementation readiness check (Architect)
2. Sprint planning (SM)
3. Begin implementation

# Workflow: Correct Course

## Purpose
Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation.

## Agent
SM (Bob) or PM (John)

## When to Use
- Major change discovered mid-implementation
- Requirements shift significantly
- Technical blocker found
- Scope needs adjustment
- Architecture revision needed

---

## Process

### Step 1: Identify the Change

**Capture the situation:**
```
What changed?
- [ ] New requirement discovered
- [ ] Existing requirement misunderstood
- [ ] Technical blocker/impossibility
- [ ] External dependency changed
- [ ] Timeline/resource constraint
- [ ] User feedback during development
- [ ] Security/compliance issue discovered
```

**Document the trigger:**
- What was the original plan?
- What new information emerged?
- When was this discovered?

---

### Step 2: Impact Analysis

**Load context and analyze:**
1. Review PRD for affected requirements
2. Review Architecture for technical impact
3. Review current sprint status
4. Review affected stories

**Assess scope of impact:**

| Impact Area | Affected? | Details |
|-------------|-----------|---------|
| Requirements | | |
| Architecture | | |
| UX Design | | |
| Current Sprint | | |
| Future Sprints | | |
| Dependencies | | |

**Severity Assessment:**
- **Minor**: Affects 1-2 stories, no architecture changes
- **Moderate**: Affects epic scope, may need architecture review
- **Major**: Affects multiple epics, requires architecture revision
- **Critical**: Fundamentally changes product direction

---

### Step 3: Propose Solutions

**Generate options (aim for 2-3):**

**Option A: [Name]**
- Description: 
- Pros:
- Cons:
- Effort estimate:
- Risk level:

**Option B: [Name]**
- Description:
- Pros:
- Cons:
- Effort estimate:
- Risk level:

**Option C: [Name]** (if applicable)
- Description:
- Pros:
- Cons:
- Effort estimate:
- Risk level:

**Recommendation:** [Which option and why]

---

### Step 4: User Decision

Present options to user and get decision:

```
Based on my analysis:

SITUATION: [summary]
IMPACT: [severity level]

OPTIONS:
1. [Option A summary]
2. [Option B summary]
3. [Option C summary] (if applicable)

MY RECOMMENDATION: [Option X] because [rationale]

Which direction would you like to take?
```

---

### Step 5: Execute Correction

Based on decision, route to appropriate agent:

**If Requirements Change:**
→ Route to PM for PRD update
→ Then Architect if architecture affected
→ Then SM for story updates

**If Architecture Change:**
→ Route to Architect for architecture revision
→ Then PM if requirements affected
→ Then SM for story updates

**If Story-Level Only:**
→ SM updates affected stories directly
→ Update sprint status

**If Scope Reduction:**
→ PM deprioritizes/removes stories
→ SM updates sprint backlog

---

### Step 6: Document the Change

Create change record in sprint-status.yaml or change log:

```yaml
course_corrections:
  - date: YYYY-MM-DD
    trigger: "[what caused the change]"
    severity: minor|moderate|major|critical
    decision: "[option chosen]"
    affected_stories:
      - story-XXX
      - story-YYY
    documents_updated:
      - PRD (if applicable)
      - Architecture (if applicable)
      - Stories
    notes: "[any additional context]"
```

---

## Output

- Change proposal document (if major change)
- Updated stories
- Updated sprint-status.yaml
- Updated planning documents (if needed)

---

## Tips

1. **Don't panic** - Changes happen, that's why we have this workflow
2. **Communicate early** - Better to course-correct early than late
3. **Document decisions** - Future you will thank present you
4. **Keep momentum** - Make decision and move forward
5. **Learn from it** - Update processes if this was preventable

---

## Example Session

```
You: "We discovered the third-party API doesn't support batch operations"

SM: "Let me analyze the impact...

     AFFECTED:
     - Story-007 (bulk import feature)
     - Story-012 (batch processing)
     - Architecture: Data flow section
     
     SEVERITY: Moderate
     
     OPTIONS:
     1. Sequential API calls (slow but works)
        - Effort: Low
        - Risk: Performance concerns
     
     2. Build our own batch layer
        - Effort: High (new epic)
        - Risk: Complexity
     
     3. Reduce scope to single-item operations
        - Effort: Medium (story rewrites)
        - Risk: Feature reduction
     
     RECOMMENDATION: Option 1 for MVP, plan Option 2 for v2
     
     Which direction should we take?"
```

---

## Handoffs

**Receives from:**
- Developer (found blocker)
- Any agent (discovered issue)

**Hands off to:**
- PM (requirements changes)
- Architect (technical changes)
- Developer (continue implementation)

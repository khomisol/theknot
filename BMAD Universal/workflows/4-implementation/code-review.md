# Workflow: Code Review

## Purpose
Perform senior developer quality review on completed story.

## Agent
Developer (Amelia)

## Prerequisites
- Story implementation complete
- Story status is "Ready for Review"
- All tests passing

---

## Process

### Step 1: Load Context

**Actions:**
1. Read the story file completely
2. Review acceptance criteria
3. Note the technical context
4. Load architecture reference

---

### Step 2: Review Code Changes

**For each changed file:**

#### Functionality
- [ ] Does it do what the AC says?
- [ ] Are edge cases handled?
- [ ] Is error handling complete?

#### Code Quality
- [ ] Follows project conventions?
- [ ] Clear naming?
- [ ] No unnecessary complexity?
- [ ] No code duplication?

#### Security
- [ ] Input validation?
- [ ] No sensitive data exposed?
- [ ] Auth/authz correct?

#### Performance
- [ ] No obvious bottlenecks?
- [ ] Efficient queries?
- [ ] Appropriate caching?

---

### Step 3: Review Tests

**Check:**
- [ ] Tests exist for new code
- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] Coverage adequate (>80%)

**Run tests:**
```
npm test
npm test -- --coverage
```

---

### Step 4: Run Quality Checks

**Execute:**
```
✓ npm test (all passing)
✓ npm run lint (no errors)
✓ npm run type-check (no errors)
✓ npm run build (succeeds)
```

---

### Step 5: Document Findings

**Find 3-10 specific issues** (be thorough, not rubber-stamp):

**Issue Categories:**
- 🔴 **Critical** - Must fix before merge
- 🟠 **Major** - Should fix, significant impact
- 🟡 **Minor** - Nice to fix, low impact
- 💡 **Suggestion** - Optional improvement

**Format:**
```markdown
## Code Review Notes

### Issues Found

#### 🔴 Critical
1. **[File:Line]** - [Issue description]
   - Problem: [What's wrong]
   - Fix: [How to fix]

#### 🟠 Major
1. **[File:Line]** - [Issue description]
   - Problem: [What's wrong]
   - Fix: [How to fix]

#### 🟡 Minor
1. **[File:Line]** - [Issue description]

#### 💡 Suggestions
1. [Suggestion]

### Summary
- Critical: [N]
- Major: [N]
- Minor: [N]
- Suggestions: [N]

### Verdict
[ ] Approved
[ ] Approved with minor fixes
[ ] Changes requested
```

---

### Step 6: Update Story

**Append review notes to story file**

**If approved:**
- Update status to "Done" (or ready for final fixes)
- Update sprint-status.yaml

**If changes requested:**
- Keep status as "In Progress"
- Developer addresses issues
- Re-run code review

---

## Output

- Review notes in story file
- Updated story status
- Clear next steps

---

## Review Mindset

### Be Thorough
- Don't rubber-stamp
- Find real issues
- Challenge assumptions

### Be Constructive
- Explain why, not just what
- Suggest fixes
- Acknowledge good work

### Be Consistent
- Same standards for all
- Follow project conventions
- Document decisions

---

## Common Issues to Look For

1. **Missing error handling**
2. **Hardcoded values**
3. **Missing tests**
4. **Security vulnerabilities**
5. **Performance issues**
6. **Code duplication**
7. **Poor naming**
8. **Missing documentation**
9. **Incomplete AC coverage**
10. **Inconsistent patterns**

---

## Next Steps

**If approved:**
- Mark story done
- Move to next story

**If changes needed:**
- Developer fixes issues
- Re-run code review
- Repeat until approved

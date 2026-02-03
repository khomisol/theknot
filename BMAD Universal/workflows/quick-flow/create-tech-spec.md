# Workflow: Create Tech Spec

## Purpose
Create a focused technical specification for small work.

## Agent
Quick Flow Solo Dev (Barry) or PM (John)

## Prerequisites
- Clear understanding of the change needed
- Access to codebase (if brownfield)

---

## Process

### Step 1: Understand the Change

**Questions:**
1. What's the problem or feature?
2. What's the expected outcome?
3. What's the scope?

---

### Step 2: Investigate (Brownfield)

**If existing codebase:**
1. Scan relevant code
2. Identify affected files
3. Note existing patterns
4. Check for dependencies

---

### Step 3: Specify

**Document:**

```markdown
# Tech Spec: [Title]

## Problem
[What's broken or missing?]

## Solution
[How we'll fix/add it]

## Changes
| File | Change |
|------|--------|
| `path/file.ts` | [What changes] |

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Notes
[Any gotchas]
```

---

### Step 4: Validate

**Check:**
- [ ] Problem clearly stated
- [ ] Solution makes sense
- [ ] Files identified
- [ ] Criteria testable

---

## Output

- `docs/tech-spec.md`
- Ready for quick-dev

---

## Next Steps

After tech spec:
- Run quick-dev to implement
- Or hand to Developer for larger work

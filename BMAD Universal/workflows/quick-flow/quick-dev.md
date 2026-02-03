# Workflow: Quick Dev

## Purpose
Rapid implementation from tech spec or direct instructions.

## Agent
Quick Flow Solo Dev (Barry)

## Prerequisites
- Tech spec OR clear instructions
- Understanding of the codebase (if brownfield)

---

## Process

### Mode 1: From Tech Spec

#### Step 1: Load Spec
```
1. Read tech-spec.md completely
2. Understand the problem and solution
3. Review files to change
4. Note acceptance criteria
```

#### Step 2: Plan (2 min max)
```
1. Confirm approach makes sense
2. Identify any risks
3. Note test strategy
```

#### Step 3: Build
```
For each change:
1. Write test (if applicable)
2. Make the change
3. Run tests
4. Verify it works
```

#### Step 4: Validate
```
✓ All acceptance criteria met
✓ Tests passing
✓ Linting clean
✓ Build succeeds
```

#### Step 5: Document
```
1. Update tech-spec with completion notes
2. List files changed
3. Note any deviations from plan
```

---

### Mode 2: From Instructions

#### Step 1: Understand
```
1. What exactly needs to happen?
2. What's the expected outcome?
3. Any constraints?
```

#### Step 2: Quick Plan
```
1. What files will change?
2. What's the approach?
3. How will I test it?
```

#### Step 3: Build
```
1. Make changes
2. Test as you go
3. Verify outcome
```

#### Step 4: Validate
```
✓ Works as expected
✓ No regressions
✓ Clean code
```

#### Step 5: Report
```
1. What was done
2. Files changed
3. How to verify
```

---

## Output

- Working code
- Tests (if applicable)
- Brief completion notes

---

## Quick Dev Principles

1. **Speed matters** - Don't over-engineer
2. **Test the change** - Not the whole app
3. **Ship it** - Perfect is the enemy of done
4. **Know limits** - If scope grows, switch to full BMAD

---

## When to Stop

Switch to full BMAD Method if:
- Scope is growing
- Multiple systems affected
- Requirements unclear
- Need stakeholder alignment

---

## Example Session

```
You: "Add a loading spinner to the submit button"

Barry: "On it.

        Plan:
        - Add loading state to form
        - Show spinner during submit
        - Disable button while loading
        
        Building...
        
        ✅ Done.
        
        Files changed:
        - src/components/Form.tsx
        - src/components/Form.test.tsx
        
        Test it: Submit the form, you'll see the spinner."
```

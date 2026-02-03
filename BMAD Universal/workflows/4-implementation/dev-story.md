# Workflow: Dev Story

## Purpose
Implement a user story with tests, following TDD principles.

## Agent
Developer (Amelia)

## Prerequisites
- Story file exists and is marked "Ready" or "In Progress"
- Architecture document available
- Sprint status file exists

---

## Process

### Step 1: Load Context

**Actions:**
1. Read the ENTIRE story file before any implementation
2. Load project-context.md if available
3. Review the task/subtask sequence - this is your authoritative guide
4. Check previous story's Dev Notes for context

**Critical:** Never start coding until you understand the full story.

---

### Step 2: Update Status

**Actions:**
1. Update story status to "In Progress"
2. Update sprint-status.yaml

---

### Step 3: Implement Tasks (In Order)

For EACH task in the story (follow exact sequence):

#### 3a. Write Failing Test (RED)
```
- Identify what this task should accomplish
- Write a test that verifies the expected behavior
- Run test - it should FAIL (this is correct)
```

#### 3b. Implement to Pass (GREEN)
```
- Write the minimum code to make the test pass
- Run test - it should PASS
- If it fails, fix the implementation (not the test)
```

#### 3c. Refactor (REFACTOR)
```
- Clean up the code while keeping tests green
- Remove duplication
- Improve naming
- Run tests again - must still pass
```

#### 3d. Mark Task Complete
```
- Mark task checkbox [x] in story file
- Only mark complete when BOTH implementation AND tests done
```

#### 3e. Run Full Test Suite
```
- Run ALL tests, not just new ones
- NEVER proceed if any test fails
- Fix failures before moving to next task
```

**Repeat for each task in sequence. No skipping. No reordering.**

---

### Step 4: Validation

After ALL tasks complete, run full validation:

```
✓ All tests passing
✓ Coverage meets requirements (>80%)
✓ Linting passes (no errors)
✓ Type checking passes
✓ Build succeeds
```

**All must pass before proceeding.**

---

### Step 5: Documentation

Update the story file with Dev Notes:

```markdown
## Dev Notes

### Implementation Notes
[What was implemented and how]

### Decisions Made
[Any decisions made during implementation]

### Lessons Learned
[What would you do differently?]

### Files Changed
- path/to/file1.ts
- path/to/file2.ts
```

---

### Step 6: Update Status

**Actions:**
1. Update story status to "Ready for Review"
2. Update sprint-status.yaml
3. List all changed files

---

## Output

- Implemented code with tests
- Updated story file with Dev Notes
- Updated sprint status

---

## Quality Checklist

Before marking complete:
- [ ] All tasks done (in order)
- [ ] All tests passing
- [ ] Coverage adequate
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Dev Notes written
- [ ] Files listed

---

## Common Issues

### Tests Failing
- Don't skip - fix the issue
- Check if test is correct first
- Then check implementation

### Task Unclear
- Re-read acceptance criteria
- Check architecture reference
- Ask for clarification if needed

### Scope Creep
- Only implement what's in the story
- Note additional work for future stories
- Don't gold-plate

---

## Next Steps

After dev-story complete:
1. Run code-review workflow
2. Address any review feedback
3. Mark story done when review passes

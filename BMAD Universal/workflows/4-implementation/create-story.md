# Workflow: Create Story

## Purpose
Create the next user story from epics, ready for development.

## Agent
Scrum Master (Bob)

## Prerequisites
- Sprint status file exists
- Epics file with story definitions
- Architecture document (for technical context)

---

## Process

### Step 1: Identify Next Story

**Actions:**
1. Read sprint-status.yaml
2. Find the next story with status "TODO"
3. Note the epic it belongs to
4. Load the relevant epic section from epics.md

---

### Step 2: Gather Context

**Actions:**
1. Review architecture document for relevant technical details
2. Check previous story's Dev Notes (if any)
3. Identify dependencies on other stories
4. Note any blockers

**Context Sources:**
- `docs/architecture.md` - Technical decisions
- `docs/epics.md` - Story definitions
- Previous story files - Dev Notes and lessons

---

### Step 3: Draft Story

Use the story template (`templates/story.md`) and fill in:

#### Story Info
```markdown
# Story: [EPIC].[STORY] - [Title]

## Status
- [x] TODO
- [ ] In Progress
- [ ] Ready for Review
- [ ] Done

## Story Info
- **Epic:** [Epic Name]
- **Priority:** [From epic]
- **Estimate:** [If known]
```

#### User Story
```markdown
## User Story

**As a** [user type from epic],
**I want** [goal from epic],
**So that** [benefit from epic].
```

#### Acceptance Criteria
```markdown
## Acceptance Criteria

- [ ] **AC1:** [Specific, testable criterion]
- [ ] **AC2:** [Specific, testable criterion]
- [ ] **AC3:** [Specific, testable criterion]
```

**Rules for AC:**
- Must be testable (yes/no answer)
- Must be specific (no ambiguity)
- Cover happy path AND error cases
- Independent of implementation

#### Tasks
```markdown
## Tasks

### Task 1: [Task Name]
- [ ] Subtask 1.1: [Description]
- [ ] Subtask 1.2: [Description]

### Task 2: [Task Name]
- [ ] Subtask 2.1: [Description]

### Task 3: Write Tests
- [ ] Unit tests for [component]
- [ ] Integration tests for [flow]
```

**Rules for Tasks:**
- Sequence by dependency
- Each task is completable independently
- Include test tasks
- Subtasks provide detail

#### Technical Context
```markdown
## Technical Context

### Architecture Reference
[Link to or excerpt from architecture.md]

### Dependencies
- [Story X.Y - status]
- [External API - status]

### Affected Files
- `src/components/Feature.tsx`
- `src/api/feature.ts`
- `tests/feature.test.ts`
```

#### Test Requirements
```markdown
## Test Requirements

### Unit Tests
- [ ] [Component/function to test]

### Integration Tests
- [ ] [Flow to test]

### Edge Cases
- [Edge case 1]
- [Edge case 2]
```

---

### Step 4: Validate Story

Run through story-draft-checklist:
- [ ] User story format correct
- [ ] All AC testable
- [ ] Tasks properly sequenced
- [ ] Technical context included
- [ ] Dependencies identified

---

### Step 5: Save and Update

**Actions:**
1. Save story to `docs/sprint-artifacts/story-[EPIC].[STORY].md`
2. Update sprint-status.yaml with story file path
3. Optionally mark as "Ready" if no blockers

---

## Output

- Story file: `docs/sprint-artifacts/story-X.Y.md`
- Updated sprint-status.yaml

---

## Story Quality Checklist

- [ ] Clear user story format
- [ ] Testable acceptance criteria
- [ ] Sequenced tasks with subtasks
- [ ] Technical context from architecture
- [ ] Dependencies identified
- [ ] Test requirements specified
- [ ] No ambiguous language

---

## Next Steps

After story created:
1. (Optional) Run validate-story for quality check
2. Developer runs dev-story to implement
3. Developer runs code-review when complete

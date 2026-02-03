# Workflow: Sprint Planning

## Purpose
Initialize sprint tracking for Phase 4 implementation.

## Agent
Scrum Master (Bob)

## Prerequisites
- Epics and stories defined (in epics.md)
- Architecture document complete
- Ready to begin implementation

---

## Process

### Step 1: Load Epics

**Actions:**
1. Read `docs/epics.md`
2. Extract all epics and their stories
3. Note story sequence and dependencies

---

### Step 2: Create Sprint Status File

**Create:** `docs/sprint-artifacts/sprint-status.yaml`

**Structure:**
```yaml
project:
  name: "[Project Name]"
  track: "bmad-method"
  phase: "implementation"

current:
  epic: 1
  story: "1.1"
  status: "todo"

epics:
  - id: 1
    name: "[Epic 1 Name]"
    status: "todo"
    stories:
      - id: "1.1"
        name: "[Story Name]"
        status: "todo"
        file: ""
      - id: "1.2"
        name: "[Story Name]"
        status: "todo"
        file: ""
  
  - id: 2
    name: "[Epic 2 Name]"
    status: "todo"
    stories:
      - id: "2.1"
        name: "[Story Name]"
        status: "todo"
        file: ""

progress:
  total_epics: [N]
  completed_epics: 0
  total_stories: [N]
  completed_stories: 0
  percentage: 0

history:
  - date: "[DATE]"
    action: "Sprint initialized"
    by: "SM"
```

---

### Step 3: Create Sprint Artifacts Folder

**Create:** `docs/sprint-artifacts/`

This folder will contain:
- sprint-status.yaml
- Individual story files (story-1.1.md, etc.)

---

### Step 4: Identify First Story

**Actions:**
1. Find first story in sequence (usually 1.1)
2. Check for any blockers
3. Note dependencies

**Update current in sprint-status.yaml:**
```yaml
current:
  epic: 1
  story: "1.1"
  status: "todo"
```

---

### Step 5: Review Sprint Scope

**Confirm:**
- [ ] All epics captured
- [ ] All stories listed
- [ ] Sequence makes sense
- [ ] Dependencies noted
- [ ] First story identified

---

## Output

- `docs/sprint-artifacts/sprint-status.yaml`
- Sprint artifacts folder created
- Ready to create first story

---

## Status Values

**Epic Status:**
- `todo` - Not started
- `in-progress` - At least one story started
- `done` - All stories complete

**Story Status:**
- `todo` - Not started
- `in-progress` - Being implemented
- `review` - Ready for code review
- `done` - Complete

---

## Next Steps

After sprint planning:
1. Create first story (SM)
2. Implement story (Developer)
3. Code review (Developer)
4. Repeat for all stories

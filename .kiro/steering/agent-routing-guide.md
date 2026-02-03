---
inclusion: always
---

# BMAD Agent Routing Guide for Kiro Specs

## Overview

This guide helps route between BMAD Universal agents and Kiro spec workflows based on user intent.

## When to Use BMAD Agents

### PM (John) - Product Manager
**Activate when user wants to:**
- Create or update PRD
- Define new features or requirements
- Clarify user stories
- Update functional requirements
- Make product decisions

**Files:** `scraper-automation-tool/docs/PRD.md`

**Example requests:**
- "Update the PRD with new feature"
- "Add functional requirement for webhooks"
- "Define user persona for CRM integration"

### Architect (Winston) - System Architect
**Activate when user wants to:**
- Design system architecture
- Make technology decisions
- Define API contracts
- Plan deployment strategy
- Create architecture diagrams

**Files:** `scraper-automation-tool/docs/architecture.md`

**Example requests:**
- "Design the webhook delivery system"
- "Should we use PostgreSQL or SQLite?"
- "Create deployment architecture for VPS"

### SM (Bob) - Scrum Master
**Activate when user wants to:**
- Break down epics into stories
- Plan sprints
- Estimate story points
- Track progress
- Run retrospectives

**Files:** `scraper-automation-tool/docs/epics.md`, `docs/sprint-artifacts/`

**Example requests:**
- "Break down Epic 5 into stories"
- "Plan Sprint 2"
- "Update sprint status"
- "Run retrospective for Sprint 1"

### Developer (Amelia) - Developer
**Activate when user wants to:**
- Implement features
- Write code
- Fix bugs
- Refactor code
- Review code

**Files:** `scraper-automation-tool/src/`

**Example requests:**
- "Implement the job queue"
- "Fix the pagination bug"
- "Refactor the adapter pattern"

### TEA (Murat) - Test Engineer
**Activate when user wants to:**
- Design test strategy
- Write tests
- Set up CI/CD
- Review test coverage
- Create test plans

**Files:** `scraper-automation-tool/src/tests/`

**Example requests:**
- "Design test strategy for API"
- "Set up CI/CD pipeline"
- "Review test coverage"

## When to Use Kiro Specs

### Creating Specs
**Use Kiro spec workflow when user wants to:**
- Create detailed implementation specs
- Define correctness properties
- Break down into tasks
- Plan property-based testing

**Files:** `.kiro/specs/{feature-name}/`

**Example requests:**
- "Create Kiro spec for Epic 3"
- "Define correctness properties for data export"
- "Break down Epic 5 into tasks"

### Executing Specs
**Use Kiro task execution when user wants to:**
- Implement tasks from spec
- Write property-based tests
- Update task status
- Track task progress

**Files:** `.kiro/specs/{feature-name}/tasks.md`

**Example requests:**
- "Execute tasks from scraper-api-core"
- "Implement Property 1.1: Job ID Uniqueness"
- "Update task status for task 4.7"

## Decision Tree

```
User Request
│
├─ High-level planning? → BMAD Agents
│  ├─ Product features? → PM (John)
│  ├─ Architecture? → Architect (Winston)
│  ├─ Sprint planning? → SM (Bob)
│  ├─ Implementation? → Developer (Amelia)
│  └─ Testing strategy? → TEA (Murat)
│
└─ Detailed implementation? → Kiro Specs
   ├─ Create spec? → Kiro spec workflow
   ├─ Execute tasks? → Kiro task execution
   └─ Write PBT? → Kiro property-based testing
```

## Integration Patterns

### Pattern 1: Epic → Spec → Implementation

**Step 1: PM creates epic (BMAD)**
```
@pm - Create Epic 8: Advanced Monitoring
```

**Step 2: Create Kiro spec**
```
Create Kiro spec for Epic 8: Advanced Monitoring
```

**Step 3: Developer implements (Kiro)**
```
Execute tasks from .kiro/specs/advanced-monitoring/tasks.md
```

### Pattern 2: Architecture → Design → Tasks

**Step 1: Architect designs system (BMAD)**
```
@architect - Design webhook delivery system
```

**Step 2: Create detailed design in spec (Kiro)**
```
Create design.md for webhook-delivery spec with correctness properties
```

**Step 3: Break down into tasks (Kiro)**
```
Create tasks.md for webhook-delivery spec
```

### Pattern 3: Sprint Planning → Task Execution

**Step 1: SM plans sprint (BMAD)**
```
@sm - Plan Sprint 2 with Epic 5 and Epic 6
```

**Step 2: Execute tasks (Kiro)**
```
Execute tasks from .kiro/specs/n8n-integration/tasks.md
Execute tasks from .kiro/specs/crm-integration/tasks.md
```

**Step 3: Update progress (BMAD + Kiro)**
```
Update task status in Kiro specs
Update PROJECT-STATUS.md with epic completion
```

## Routing Examples

### Example 1: "Add webhook support"

**Analysis:**
- High-level feature request
- Needs product definition
- Needs architecture design

**Route:**
1. **PM (John)** - Add functional requirement to PRD
2. **Architect (Winston)** - Design webhook system
3. **Kiro Spec** - Create detailed spec with properties
4. **Developer (Amelia)** - Implement via Kiro tasks

### Example 2: "Create spec for Epic 5"

**Analysis:**
- Detailed implementation planning
- Needs correctness properties
- Needs task breakdown

**Route:**
1. **Kiro Spec Workflow** - Create requirements.md, design.md, tasks.md
2. **SM (Bob)** - Review and estimate (optional)

### Example 3: "Implement job queue"

**Analysis:**
- Implementation work
- Spec already exists
- Tasks defined

**Route:**
1. **Kiro Task Execution** - Execute tasks from scraper-api-core/tasks.md
2. **Developer (Amelia)** - Write code and tests

### Example 4: "Plan Sprint 2"

**Analysis:**
- Sprint planning
- Story selection
- Velocity estimation

**Route:**
1. **SM (Bob)** - Plan sprint, select stories
2. **Kiro Specs** - Reference tasks.md for effort estimates

### Example 5: "Write property-based test for job ID uniqueness"

**Analysis:**
- Property-based testing
- Spec already defines property
- Implementation task

**Route:**
1. **Kiro Task Execution** - Implement PBT task from tasks.md
2. **TEA (Murat)** - Review test strategy (optional)

## Quick Reference

### BMAD Agents (High-Level)
- **PM:** Product features, requirements, user stories
- **Architect:** System design, technology, deployment
- **SM:** Sprint planning, story breakdown, progress tracking
- **Developer:** Code implementation, bug fixes, refactoring
- **TEA:** Test strategy, CI/CD, test coverage

### Kiro Specs (Detailed)
- **Create Spec:** requirements.md, design.md, tasks.md
- **Execute Tasks:** Follow tasks.md sequentially
- **Write PBT:** Implement correctness properties
- **Track Progress:** Update task status

## Best Practices

### 1. Start High-Level (BMAD)
Always start with BMAD agents for:
- New features (PM)
- Architecture decisions (Architect)
- Sprint planning (SM)

### 2. Then Go Detailed (Kiro)
Create Kiro specs for:
- Implementation details
- Correctness properties
- Task breakdown

### 3. Execute with Kiro
Use Kiro task execution for:
- Writing code
- Writing tests
- Tracking progress

### 4. Track with Both
Update both:
- Kiro task status (task-level)
- BMAD PROJECT-STATUS.md (epic-level)

## Common Mistakes

### ❌ Don't: Skip BMAD planning
**Wrong:** "Create Kiro spec for new feature X"  
**Right:** "@pm - Define feature X" → Then create Kiro spec

### ❌ Don't: Use BMAD for implementation details
**Wrong:** "@developer - Implement Property 1.1"  
**Right:** "Execute task 4.7 from scraper-api-core/tasks.md"

### ❌ Don't: Create specs without epics
**Wrong:** "Create Kiro spec for random feature"  
**Right:** "@pm - Add epic to epics.md" → Then create Kiro spec

### ❌ Don't: Forget to update both
**Wrong:** Update only Kiro task status  
**Right:** Update Kiro tasks + BMAD PROJECT-STATUS.md

## Summary

**BMAD = Strategic Planning**
- PRD, Architecture, Epics
- High-level decisions
- Stakeholder communication

**Kiro = Tactical Execution**
- Requirements, Design, Tasks
- Correctness properties
- Property-based testing

**Together = Complete Workflow**
- BMAD for planning
- Kiro for implementation
- Both for tracking

---

**Created:** January 26, 2026  
**Purpose:** Guide routing between BMAD agents and Kiro specs  
**Framework:** BMAD Universal 1.0.0 + Kiro Specs

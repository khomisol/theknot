---
inclusion: always
---

# BMAD + Kiro Integration Steering

## Overview

This project uses **BMAD Universal** methodology for high-level planning (PRD, Architecture, Epics) and **Kiro specs** for detailed implementation with property-based testing.

## Document Hierarchy

### BMAD Documents (High-Level Planning)
Located in `scraper-automation-tool/docs/`:

1. **PRD.md** - Product requirements, user personas, functional requirements
2. **architecture.md** - System design, technology stack, deployment
3. **epics.md** - High-level feature breakdown, story estimates
4. **PROJECT-STATUS.md** - Overall project progress, sprint tracking

### Kiro Specs (Implementation Details)
Located in `.kiro/specs/{feature-name}/`:

1. **requirements.md** - User stories with acceptance criteria
2. **design.md** - Detailed design with correctness properties
3. **tasks.md** - Implementation tasks with PBT tasks

## When to Use Each

### Use BMAD Documents When:
- Planning new features or epics
- Making architectural decisions
- Estimating high-level effort
- Tracking overall project progress
- Communicating with stakeholders

### Use Kiro Specs When:
- Implementing a specific feature
- Writing property-based tests
- Breaking down tasks for a sprint
- Tracking task-level progress
- Defining correctness properties

## Workflow Integration

### Phase 1: Planning (BMAD)
1. Create/update PRD with functional requirements
2. Design architecture and technology choices
3. Break down into epics with story estimates
4. Update PROJECT-STATUS.md with progress

### Phase 2: Specification (Kiro)
1. Create Kiro spec directory for epic
2. Write requirements.md from PRD functional requirements
3. Write design.md with correctness properties
4. Write tasks.md with implementation breakdown

### Phase 3: Implementation (Kiro)
1. Follow tasks.md sequentially
2. Write property-based tests for correctness properties
3. Update task status as work completes
4. Run tests continuously

### Phase 4: Tracking (BMAD + Kiro)
1. Update task status in Kiro specs
2. Update epic completion in BMAD epics.md
3. Update PROJECT-STATUS.md with overall progress
4. Run sprint retrospectives

## Property-Based Testing

### What Are Correctness Properties?

Correctness properties are **universal truths** about your system that should hold for all inputs. Instead of testing specific examples, PBT generates hundreds of random inputs to verify properties.

**Example:**
- **Unit Test:** "Job ID for job 1 is unique"
- **Property Test:** "ALL job IDs are unique, for ANY number of jobs"

### How to Define Properties

**Format in design.md:**
```markdown
### Property X.Y: Property Name
**Validates:** Requirements A.B, C.D
**Property:** [Universal statement about system behavior]
**Test Strategy:** [How to test this property]
```

**Example:**
```markdown
### Property 1.1: Job ID Uniqueness
**Validates:** Requirements 1.1, 1.2
**Property:** Every submitted job receives a unique job ID
**Test Strategy:** Generate 1000 jobs, verify all IDs are unique (UUID v4)
```

### How to Implement PBT

**Using fast-check:**
```typescript
import fc from 'fast-check';

test('Property 1.1: Job ID Uniqueness', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({ /* job params */ }), { minLength: 100, maxLength: 1000 }),
      async (jobParams) => {
        const jobIds = await Promise.all(
          jobParams.map(params => submitJob(params))
        );
        
        const uniqueIds = new Set(jobIds);
        expect(uniqueIds.size).toBe(jobIds.length);
      }
    )
  );
});
```

### PBT Task Format

**In tasks.md:**
```markdown
- [ ] X.Y **PBT:** Property test for [property name] (Property A.B)
```

**Example:**
```markdown
- [ ] 4.7 **PBT:** Property test for job ID uniqueness (Property 1.1)
```

## Current Specs

### Scraper API Core
- **Epic:** Epic 1 - Core API & Job Queue
- **Location:** `.kiro/specs/scraper-api-core/`
- **Status:** Ready for implementation
- **Properties:** 6 correctness properties defined
- **Tasks:** 12 task groups, 60+ tasks

### TheKnot Adapter
- **Epic:** Epic 2 - TheKnot Site Adapter
- **Location:** `.kiro/specs/theknot-adapter/`
- **Status:** Ready for implementation
- **Properties:** 5 correctness properties defined
- **Tasks:** 12 task groups, 60+ tasks

## Creating New Specs

### Step 1: Identify Epic
Look at `scraper-automation-tool/docs/epics.md` and choose an epic to implement.

### Step 2: Create Spec Directory
```bash
mkdir -p .kiro/specs/{epic-name}
```

### Step 3: Write Requirements
Extract user stories from PRD and epic description:
- User stories with "As a... I want... So that..."
- Acceptance criteria (numbered list)
- Non-functional requirements
- Success metrics

### Step 4: Write Design
Design the implementation:
- Architecture overview
- API contracts or interfaces
- Database schemas
- **Correctness properties** (key for PBT)
- Testing strategy

### Step 5: Write Tasks
Break down into implementable tasks:
- Task groups (1-12)
- Individual tasks with checkboxes
- **PBT tasks** for each correctness property
- Dependencies and estimates

### Step 6: Implement
Follow tasks.md:
1. Mark task as in progress
2. Write code
3. Write property-based tests
4. Mark task as complete
5. Update PROJECT-STATUS.md

## Task Status Management

### Using Kiro Task Status Tool

**Mark task as in progress:**
```
Update task status: "1.1 Initialize TypeScript project" to "in_progress"
```

**Mark task as complete:**
```
Update task status: "1.1 Initialize TypeScript project" to "completed"
```

**Kiro will:**
- Update checkbox in tasks.md
- Track progress
- Update sprint status

## Testing Strategy

### Test Pyramid

```
        /\
       /  \  Property-Based Tests (Correctness Properties)
      /____\
     /      \  Integration Tests (API flows, E2E)
    /________\
   /          \  Unit Tests (Functions, classes)
  /____________\
```

### Coverage Targets
- **Unit Tests:** >80% code coverage
- **Integration Tests:** All API endpoints, all user flows
- **Property-Based Tests:** All correctness properties

### Running Tests
```bash
# All tests
npm test

# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests only
npm test -- --testPathPattern=integration

# Property-based tests only
npm test -- --testPathPattern=property

# With coverage
npm test -- --coverage
```

## Sprint Planning

### Sprint Structure
- **Duration:** 1 week (recommended for solo dev)
- **Velocity:** 20-25 story points per week
- **Ceremonies:** Sprint planning, daily standup (self), retrospective

### Sprint Planning Process
1. Review tasks.md for next epic
2. Select tasks for sprint (based on velocity)
3. Update sprint-status.yaml
4. Execute tasks sequentially
5. Update task status as work completes
6. Run sprint retrospective

### Sprint Artifacts
Located in `scraper-automation-tool/docs/sprint-artifacts/`:
- `sprint-status.yaml` - Current sprint status
- `SPRINT-{N}-RETROSPECTIVE.md` - Sprint retrospective

## Cost Tracking

### Zero-Cost Target
- $0/month infrastructure (runs on existing Windows PC)
- $0/month database (SQLite)
- $0/month job queue (in-memory)
- $0/month proxies (not needed for TheKnot)
- $0/month CAPTCHA (not needed for TheKnot)

### Optional Costs (Future)
- VPS hosting: $5-10/month (only if 24/7 needed)
- PostgreSQL: $0 (self-host) or $10/month (managed)
- Redis: $0 (self-host) or $5/month (managed)

**Always document costs in:**
- PRD (cost analysis section)
- Architecture (deployment section)
- PROJECT-STATUS.md (cost analysis section)

## Success Metrics

### Technical Metrics
Track in PROJECT-STATUS.md:
- API response time <100ms
- Job start time <5 seconds
- 90%+ success rate
- 3 concurrent jobs
- >80% test coverage

### Business Metrics
Track in PROJECT-STATUS.md:
- Zero recurring costs
- Matches BrowserAct output format
- <5 minute setup time
- n8n integration <1 hour

## References

### BMAD Universal
- Orchestrator: `BMAD Universal/ORCHESTRATOR.md`
- Agents: `BMAD Universal/agents/`
- Workflows: `BMAD Universal/workflows/`
- Templates: `BMAD Universal/templates/`

### Kiro Specs
- Spec README: `.kiro/specs/README.md`
- Scraper API Core: `.kiro/specs/scraper-api-core/`
- TheKnot Adapter: `.kiro/specs/theknot-adapter/`

### External Resources
- fast-check: https://fast-check.dev/
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/

---

**Created:** January 26, 2026  
**Framework:** BMAD Universal 1.0.0 + Kiro Specs  
**Purpose:** Guide integration of BMAD methodology with Kiro spec-driven development

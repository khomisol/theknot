# BMAD Universal Workflows

Quick reference for all workflows organized by phase.

---

## Phase 1: Analysis (Optional)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Brainstorm](1-analysis/brainstorm.md) | `*brainstorm` | Analyst | Generate and explore ideas |
| [Research](1-analysis/research.md) | `*research` | Analyst | Domain, market, technical research |
| [Product Brief](1-analysis/product-brief.md) | `*product-brief` | Analyst | Initial product vision document |
| [Document Project](1-analysis/document-project.md) | `*document-project` | Analyst / Tech Writer | Document existing codebase |

---

## Phase 2: Planning (Required)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [PRD](2-planning/prd.md) | `*prd` | PM | Product Requirements (create/edit/validate) |
| [Tech Spec](2-planning/tech-spec.md) | `*tech-spec` | PM / Quick Flow | Technical specification |
| [UX Design](2-planning/ux-design.md) | `*ux-design` | UX Designer | User experience specification |

---

## Phase 3: Solutioning (For larger projects)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Architecture](3-solutioning/architecture.md) | `*architecture` | Architect | System architecture design |
| [Create Epics & Stories](3-solutioning/create-epics-stories.md) | `*create-epics` | PM | Break PRD into implementable pieces |
| [Implementation Readiness](3-solutioning/implementation-readiness.md) | `*check-ready` | Architect | Validate all docs aligned |

---

## Phase 4: Implementation (Required)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Sprint Planning](4-implementation/sprint-planning.md) | `*sprint-planning` | SM | Initialize sprint tracking |
| [Sprint Status](4-implementation/sprint-status.md) | `*sprint-status` | SM | Sprint progress reporting |
| [Create Story](4-implementation/create-story.md) | `*create-story` | SM | Draft next story |
| [Dev Story](4-implementation/dev-story.md) | `*dev-story` | Developer | Implement story |
| [Code Review](4-implementation/code-review.md) | `*code-review` | Developer | Quality review |
| [Correct Course](4-implementation/correct-course.md) | `*correct-course` | SM | Mid-sprint adjustments |
| [Retrospective](4-implementation/retrospective.md) | `*retrospective` | SM | Post-epic review |

---

## Quick Flow (Rapid Development)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Create Tech Spec](quick-flow/create-tech-spec.md) | `*quick-spec` | Quick Flow | Quick specification |
| [Quick Dev](quick-flow/quick-dev.md) | `*quick-dev` | Quick Flow | Rapid implementation |

---

## Testing & Quality (TEA Workflows)

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Test Framework](testing/framework.md) | `*framework` | TEA | Design test infrastructure |
| [Test Design](testing/test-design.md) | `*test-design` | TEA | Create test specifications |
| [Test Automation](testing/automate.md) | `*automate` | TEA | Implement automated tests |
| [CI Configuration](testing/ci.md) | `*ci` | TEA | Configure CI pipeline |
| [Test Review](testing/test-review.md) | `*test-review` | TEA | Review test quality |
| [ATDD](testing/atdd.md) | `*atdd` | TEA | Acceptance test-driven development |
| [NFR Assessment](testing/nfr-assess.md) | `*nfr-assess` | TEA | Non-functional requirements testing |
| [Traceability](testing/trace.md) | `*trace` | TEA | Requirements traceability |

---

## Diagrams & Documentation

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Create Diagram](diagrams/create-diagram.md) | `*create-diagram` | Tech Writer / Architect | Generate Mermaid diagrams |

---

## Creative & Innovation

| Workflow | Command | Agent | Purpose |
|----------|---------|-------|---------|
| [Design Thinking](creative/design-thinking.md) | `*design-thinking` | Design Thinking Coach | Human-centered design |
| [Problem Solving](creative/problem-solving.md) | `*problem-solve` | Problem Solver | Systematic problem resolution |
| [Innovation Strategy](creative/innovation-strategy.md) | `*innovate` | Innovation Strategist | Business model innovation |
| [Storytelling](creative/storytelling.md) | `*storytelling` | Storyteller | Craft compelling narratives |

---

## Workflow Selection Guide

### Starting a New Project
```
Greenfield (new project):
1. *research domain → Analyst (optional)
2. *prd create → PM
3. *architecture → Architect
4. *sprint-planning → SM
5. *dev-story → Developer
```

### Working with Existing Code
```
Brownfield (existing project):
1. *document-project → Analyst
2. *prd create or *quick-spec → PM
3. *architecture (if needed) → Architect
4. *sprint-planning → SM
5. *dev-story → Developer
```

### Quick Fix or Small Feature
```
Quick Flow:
1. *quick-spec → Quick Flow
2. *quick-dev → Quick Flow
Done!
```

### Testing-First Approach
```
Test Architecture:
1. *framework → TEA
2. *test-design → TEA
3. *automate → TEA
4. *ci → TEA
```

### Mid-Sprint Adjustment
```
Course Correction:
1. *sprint-status → SM (assess situation)
2. *correct-course → SM (plan adjustment)
3. Continue with updated plan
```

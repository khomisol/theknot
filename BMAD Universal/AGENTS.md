# BMAD Universal - Complete Agent Reference

Quick reference for all 17 specialist agents with intent-based auto-routing.

---

## Intent-Based Routing

The ORCHESTRATOR automatically selects agents based on your intent:

| Your Intent | Agent Selected |
|-------------|----------------|
| Exploring ideas, brainstorming | Analyst or Brainstorm Coach |
| Defining features, requirements | PM |
| User experience, interfaces | UX Designer |
| System design, tech decisions | Architect |
| Organizing work, stories | SM |
| Writing code, implementing | Developer |
| Testing, quality | TEA |
| Documentation | Tech Writer |
| Quick fixes, small features | Quick Flow |
| Creative ideation | Brainstorm Coach |
| Complex problems | Problem Solver |
| Human-centered design | Design Thinking Coach |
| Business strategy | Innovation Strategist |
| Presentations | Presentation Master |
| Narratives, messaging | Storyteller |
| Multi-agent discussion | Party Mode |
| Custom agents/workflows | Builder |
| Version info, updates | BMAD Updater |

---

## Core Development Agents

### PM (John) 📋
**Product Manager** - Requirements, PRD, features
- `*prd create` - Create new PRD
- `*prd edit` - Modify existing PRD
- `*prd validate` - Validate PRD quality
- `*tech-spec` - Quick specification
- `*create-epics` - Break down requirements

### Analyst (Mary) 📊
**Strategic Business Analyst** - Research, discovery, brainstorming
- `*brainstorm` - Guided ideation
- `*research domain` - Industry/domain research
- `*research market` - Competitive analysis
- `*research technical` - Technical feasibility
- `*product-brief` - Initial vision document
- `*document-project` - Analyze existing codebase

### Architect (Winston) 🏗️
**System Architect** - System design, tech decisions
- `*create-architecture` - System architecture
- `*validate-architecture` - Check completeness
- `*implementation-readiness` - Validate alignment

### SM (Sally) 🏃
**Scrum Master** - Sprint planning, story creation
- `*sprint-planning` - Initialize sprint tracking
- `*sprint-status` - Sprint progress reporting
- `*create-story` - Draft next story
- `*correct-course` - Mid-sprint adjustments
- `*retrospective` - Post-epic review

### Developer (Amelia) 💻
**Senior Software Engineer** - Implementation, coding
- `*dev-story` - Implement story with TDD
- `*code-review` - Quality review
- `*story-done` - Mark complete

### TEA (Tessa) 🧪
**Test Architect** - Testing, quality, CI/CD
- `*framework` - Design test infrastructure
- `*test-design` - Create test specifications
- `*automate` - Implement test automation
- `*ci` - Configure CI pipeline
- `*test-review` - Review test quality
- `*atdd` - Acceptance test-driven development
- `*nfr-assess` - Non-functional requirements testing
- `*trace` - Requirements traceability

### UX Designer (Sally) 🎨
**UX/UI Specialist** - User experience, interfaces
- `*create-ux-design` - UX specification
- `*create-wireframe` - Visual wireframes

### Tech Writer (Paige) 📚
**Documentation Specialist** - Technical writing, diagrams
- `*document-project` - Project documentation
- `*create-diagram` - Generate Mermaid diagrams
- `*api-docs` - API documentation
- ADRs, guides, and technical docs

### Quick Flow (Barry) 🚀
**Elite Solo Developer** - Rapid development
- `*create-tech-spec` - Quick specification
- `*quick-dev` - Rapid implementation

---

## Creative Innovation Agents

### Brainstorm Coach (Carson) 🧠
**Innovation Catalyst** - Ideation, creativity
- `*brainstorm` - Guided brainstorming session

### Problem Solver (Dr. Quinn) 🔬
**Solutions Architect** - Root cause, complex problems
- `*solve` - Systematic problem-solving

### Design Thinking Coach (Maya) 🎨
**Human-Centered Design Expert** - Empathy, user needs
- Design thinking workshops

### Innovation Strategist (Victor) ⚡
**Business Model Innovator** - Strategy, disruption
- Business model innovation

### Presentation Master (Caravaggio) 🎨
**Visual Communication Expert** - Presentations, slides
- Presentation design and coaching

### Storyteller (Sophia) 📖
**Narrative Strategist** - Stories, messaging
- Narrative development

---

## Meta Agents

### BMAD Master 🧙
**Orchestrator** - Multi-agent coordination
- `*party-mode` - Multi-agent discussions
- `*list-agents` - Show all agents
- `*list-workflows` - Show all workflows

### BMAD Builder 🧙
**System Maintainer** - Custom agents/workflows
- Create custom agents
- Create custom workflows

### BMAD Updater 🔄
**Update Manager** - Version and update management
- `*version` - Show current version
- `*check-update` - Check for newer releases
- `*update` - Guide through update process

---

## Activation Methods

### 1. Auto-Routing (Recommended)
Just describe what you need:
```
"I need to define the features for this app"
→ Routes to PM automatically
```

### 2. Direct Reference
```
"@architect - Review this design"
"Act as Developer"
```

### 3. File Reference
```
Load agents/dev.md and implement story-003
```

### 4. Party Mode
```
"Let's discuss with PM, Architect, and UX"
```

---

## Agent Files

All agents are in `agents/` folder:
- `pm.md`, `analyst.md`, `architect.md`
- `sm.md`, `dev.md`, `tea.md`
- `ux-designer.md`, `tech-writer.md`
- `quick-flow-solo-dev.md`
- `brainstorming-coach.md`, `creative-problem-solver.md`
- `design-thinking-coach.md`, `innovation-strategist.md`
- `presentation-master.md`, `storyteller.md`
- `bmad-master.md`, `bmad-builder.md`, `bmad-updater.md`
- `party-mode.md`

# BMAD Universal Agents

Quick reference for all 17 specialist agents.

---

## Core Development Agents

| Agent | File | Specialty |
|-------|------|-----------|
| **PM** (John) | `pm.md` | Product requirements, features, PRD |
| **Analyst** (Mary) | `analyst.md` | Research, discovery, brainstorming |
| **Architect** (Winston) | `architect.md` | System design, tech decisions |
| **SM** (Bob) | `sm.md` | Sprint planning, story creation |
| **Developer** (Amelia) | `dev.md` | Implementation, coding, TDD |
| **TEA** (Murat) | `tea.md` | Testing, quality, CI/CD |
| **UX Designer** (Sally) | `ux-designer.md` | User experience, interfaces |
| **Tech Writer** (Paige) | `tech-writer.md` | Documentation |
| **Quick Flow** (Barry) | `quick-flow-solo-dev.md` | Rapid development |

## Creative Innovation Agents

| Agent | File | Specialty |
|-------|------|-----------|
| **Brainstorm Coach** (Carson) | `brainstorming-coach.md` | Ideation, creativity |
| **Problem Solver** (Dr. Quinn) | `creative-problem-solver.md` | Root cause analysis |
| **Design Thinking** (Maya) | `design-thinking-coach.md` | Human-centered design |
| **Innovation** (Victor) | `innovation-strategist.md` | Business strategy |
| **Presentation** (Caravaggio) | `presentation-master.md` | Visual communication |
| **Storyteller** (Sophia) | `storyteller.md` | Narratives, messaging |

## Meta Agents

| Agent | File | Specialty |
|-------|------|-----------|
| **BMAD Master** | `bmad-master.md` | Orchestration, party mode |
| **Builder** | `bmad-builder.md` | Custom agents/workflows |

---

## Activation Methods

### 1. Natural Language
```
"Act as Developer"
"I need the Architect"
"Let me talk to the PM"
```

### 2. Direct Reference
```
"@pm - Create a PRD for this feature"
"@architect - Review this design"
```

### 3. File Reference
Point your AI to the specific agent file:
```
Load agents/dev.md and implement story-003
```

### 4. Auto-Routing (Recommended)
Just describe what you need - the Orchestrator routes automatically:
```
"I need to implement the login feature" → Developer
"What features should we build?" → PM
"How should we structure the database?" → Architect
```

---

## Agent Collaboration

### Handoffs
Agents naturally hand off to each other:
- PM creates PRD → Architect designs system
- Architect completes → SM creates stories
- SM drafts story → Developer implements

### Party Mode
Bring multiple agents together:
```
"Let's have PM, Architect, and UX discuss the dashboard"
```

See `party-mode.md` for multi-agent collaboration.

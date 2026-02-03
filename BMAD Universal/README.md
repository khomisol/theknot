# BMAD Universal

**Build More, Architect Dreams** - Universal AI-Driven Development Framework

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](VERSION.yaml)
[![Based On](https://img.shields.io/badge/based%20on-BMAD--METHOD%20v6.0.0--alpha.23-green.svg)](https://github.com/bmad-code-org/BMAD-METHOD)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/LICENSE)

Zero installation. Works with any AI coding agent. Full BMAD Method functionality.

---

## Quick Start (30 seconds)

1. **Copy** this `bmad-universal/` folder to your project root
2. **Tell your AI**: "Read bmad-universal/ORCHESTRATOR.md and follow it"
3. **Start talking**: Describe what you need - agents activate automatically

```
You: "I want to build a task management app"
AI: 🤖 Analyst (Mary) is now active...
```

That's it. No npm, no installation, no configuration required.

**For automatic agent routing in Kiro, Cursor, Windsurf, etc.:** See [INTEGRATION-GUIDE.md](INTEGRATION-GUIDE.md)

---

## How It Works

### Intent-Based Agent Routing

BMAD Universal uses **semantic intent detection** to automatically select the right agent:

```
You: "I need to figure out what features this app should have"
→ System detects: Planning/Requirements intent
→ Routes to: Product Manager (John)

You: "Let's implement the login feature"  
→ System detects: Implementation intent
→ Routes to: Developer (Amelia)

You: "Is this architecture scalable enough?"
→ System detects: Technical design intent
→ Routes to: Architect (Winston)
```

No keywords needed. The system understands what you're trying to accomplish.

### The Agent Team (17 Specialists)

| Agent | Expertise | When They Activate |
|-------|-----------|-------------------|
| **PM** (John) | Requirements, PRD, features | Defining what to build |
| **Analyst** (Mary) | Research, discovery, briefs | Exploring ideas, market research |
| **Architect** (Winston) | System design, tech decisions | How to build it |
| **SM** (Bob) | Stories, sprints, planning | Organizing work |
| **Dev** (Amelia) | Implementation, coding | Building features |
| **TEA** (Murat) | Testing, quality, CI/CD | Ensuring quality |
| **UX** (Sally) | User experience, interfaces | Designing interactions |
| **Tech Writer** (Paige) | Documentation | Writing docs |
| **Quick Flow** (Barry) | Rapid development | Fast fixes, small features |
| **Builder** | Custom agents/workflows | Extending BMAD |
| **Brainstorm Coach** (Carson) | Ideation, creativity | Generating ideas |
| **Problem Solver** (Dr. Quinn) | Root cause, solutions | Solving hard problems |
| **Design Thinking** (Maya) | Human-centered design | User empathy |
| **Innovation** (Victor) | Strategy, disruption | Business innovation |
| **Presentation** (Caravaggio) | Visual communication | Creating presentations |
| **Storyteller** (Sophia) | Narratives, messaging | Crafting stories |
| **BMAD Master** | Orchestration | Multi-agent coordination |

---

## Three Ways to Use

### 1. Auto Mode (Recommended)
Just talk naturally. The orchestrator routes to the right agent.

```
"Help me brainstorm a task management app"
"Create the requirements document"
"Design the database schema"
"Implement story-003"
```

### 2. Direct Agent Mode
Reference a specific agent when you know who you need:

```
"@architect - Review this API design"
"Act as Developer and implement the auth module"
```

### 3. Party Mode
Bring multiple agents together for complex discussions:

```
"Let's have PM, Architect, and UX discuss the dashboard feature"
```

---

## Project Workflow

### Phase 1: Analysis (Optional)
- Brainstorming → `workflows/1-analysis/brainstorm.md`
- Research → `workflows/1-analysis/research.md`
- Product Brief → `workflows/1-analysis/product-brief.md`

### Phase 2: Planning (Required)
- PRD → `workflows/2-planning/prd.md`
- Tech Spec → `workflows/2-planning/tech-spec.md`
- UX Design → `workflows/2-planning/ux-design.md`

### Phase 3: Solutioning (For larger projects)
- Architecture → `workflows/3-solutioning/architecture.md`
- Epics & Stories → `workflows/3-solutioning/create-epics-stories.md`

### Phase 4: Implementation (Required)
- Sprint Planning → `workflows/4-implementation/sprint-planning.md`
- Create Story → `workflows/4-implementation/create-story.md`
- Dev Story → `workflows/4-implementation/dev-story.md`
- Code Review → `workflows/4-implementation/code-review.md`

---

## Folder Structure

```
bmad-universal/
├── ORCHESTRATOR.md          ← Start here (intent router)
├── config.yaml              ← Simple project config
├── agents/                  ← 17 specialist agents
├── workflows/               ← Step-by-step guides
├── templates/               ← Document templates
├── checklists/              ← Validation checklists
└── docs/                    ← Your project outputs
```

---

## Configuration

Edit `config.yaml` with your project details:

```yaml
project_name: "My Project"
user_name: "Your Name"
output_folder: "docs"
language: "English"
```

---

## IDE Integration

BMAD Universal works with **any AI coding tool** through simple integration.

### Quick Integration (Any Tool)

**At conversation start:**
```
"Read bmad-universal/ORCHESTRATOR.md and follow it"
```

### Automatic Integration (Recommended)

For automatic agent routing without manual prompting, add a steering/rules file to your IDE:

**Kiro:** `.kiro/steering/bmad.md`  
**Cursor:** `.cursor/rules/bmad.md`  
**Windsurf:** `.windsurf/rules/bmad.md`  
**Warp:** `WARP.md` or `~/.warp/rules/`  
**GitHub Copilot:** `.github/copilot-instructions.md`

**See complete integration instructions:** [INTEGRATION-GUIDE.md](INTEGRATION-GUIDE.md)

The guide includes:
- Copy-paste steering files for each IDE
- Verification tests
- Troubleshooting
- Custom integration templates

---

## Best Practices

### 1. Let Intent Detection Work

**Do this:**
```
"I need to figure out what features to build"
"Help me design the database"
"Implement the login page"
```

**Instead of:**
```
"Act as PM and create a PRD"  ← Works, but unnecessary
```

The orchestrator understands your goal and picks the right agent.

### 2. Trust the Agent Handoffs

Agents naturally hand off to each other:
- PM creates PRD → suggests Architect for system design
- Architect finishes → suggests SM for sprint planning
- SM creates story → suggests Developer for implementation

Just follow the flow.

### 3. Use Party Mode for Big Decisions

When you need multiple perspectives:
```
"Let's discuss the architecture with PM, Architect, and Developer"
"Get the team together to review this approach"
```

### 4. Keep Context Fresh

For best results:
- Start new conversations for new workflows
- Reference specific files when needed
- Let agents load their own context

### 5. Use Quick Flow for Small Work

For bug fixes and small features:
```
"Quick fix: the submit button doesn't work on mobile"
```
→ Routes to Quick Flow (Barry) for rapid implementation

### 6. Reference Templates

When creating documents:
```
"Create a PRD using the template in templates/prd.md"
```

---

## Common Workflows

### Starting a New Project (Greenfield)

```
1. "I want to build [your idea]"           → Analyst explores
2. "Create the requirements"               → PM creates PRD
3. "Design the system architecture"        → Architect designs
4. "Break this into stories"               → PM creates epics
5. "Let's start building"                  → SM plans sprint
6. "Implement the first story"             → Developer codes
```

### Adding to Existing Project (Brownfield)

```
1. "Document this existing codebase"       → Analyst/Tech Writer
2. "I need to add [feature]"               → PM for requirements
3. "Design how this integrates"            → Architect
4. "Create stories for this feature"       → SM
5. "Implement story 1"                     → Developer
```

### Quick Fix or Small Feature

```
1. "Fix the login bug on mobile"           → Quick Flow handles it
   OR
1. "Add dark mode toggle"                  → Quick Flow handles it
```

### Complex Problem Solving

```
1. "Users are abandoning checkout"         → Problem Solver analyzes
2. "Let's brainstorm solutions"            → Brainstorm Coach facilitates
3. "Design the fix"                        → Routes to appropriate agent
```

---

## Troubleshooting

### Agent Not Switching?

Be more explicit about your intent:
```
"I'm done planning, let's implement this"  → Routes to Developer
```

### Wrong Agent Selected?

Override manually:
```
"@architect - I need your input on this"
"Act as Developer for this task"
```

### Need Multiple Agents?

Use party mode:
```
"Let's discuss this with PM and Architect"
```

### Context Getting Lost?

Start a fresh conversation and re-reference the orchestrator:
```
"Read bmad-universal/ORCHESTRATOR.md. I'm working on [project] and need to [task]"
```

---

## File Reference

| File | Purpose |
|------|---------|
| `ORCHESTRATOR.md` | **Start here** - Intent routing system |
| `INTEGRATION-GUIDE.md` | IDE integration instructions |
| `ADAPTATION-GUIDE.md` | How to adapt BMAD-METHOD updates |
| `AGENTS.md` | Complete agent reference |
| `USAGE-GUIDE.md` | Usage patterns |
| `CHANGELOG.md` | Version history |
| `config.yaml` | Configuration |
| `VERSION.yaml` | Version tracking |

---

## Updates & Version

### Current Version
- **Version:** 1.0.0
- **Based on:** BMAD-METHOD v6.0.0-alpha.23
- **Last Updated:** 2026-01-26

### Manual Updates

BMAD Universal uses **manual updates** to maintain zero-installation philosophy.

**When new BMAD-METHOD version is released:**
1. Download new version from [BMAD-METHOD releases](https://github.com/bmad-code-org/BMAD-METHOD/releases)
2. Follow [ADAPTATION-GUIDE.md](ADAPTATION-GUIDE.md) to adapt changes
3. Update `VERSION.yaml` and `CHANGELOG.md`

**The Adaptation Guide provides:**
- Complete transformation principles
- File mapping (original → universal)
- Step-by-step adaptation process
- Quality standards and testing
- Preservation of zero-installation philosophy

Your `config.yaml` and `docs/` folder are always preserved during updates.

---

## Credits

Based on BMAD Method™ v6.0 by BMad Code, LLC  
Reconstructed as universal, installation-free framework

---

## Support

- **BMAD Discord:** https://discord.gg/gk8jAdXWmj
- **GitHub:** https://github.com/bmad-code-org/BMAD-METHOD
- **IDE Integration:** See [IDE-INTEGRATION.md](IDE-INTEGRATION.md)
- **Updates:** See [UPDATE.md](UPDATE.md)

---

**Ready to build?** 

1. Copy this folder to your project
2. Tell your AI: "Read bmad-universal/ORCHESTRATOR.md"
3. Start describing what you want to build!

The agents will guide you from idea to implementation. 🚀

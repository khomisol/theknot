# BMAD Universal - Complete Usage Guide

Detailed guide for getting the most out of BMAD Universal with any AI coding agent.

---

## Table of Contents

1. [Installation](#installation)
2. [IDE-Specific Setup](#ide-specific-setup)
3. [Understanding Intent-Based Routing](#understanding-intent-based-routing)
4. [Working with Agents](#working-with-agents)
5. [Project Workflows](#project-workflows)
6. [Best Practices](#best-practices)
7. [Advanced Usage](#advanced-usage)
8. [Troubleshooting](#troubleshooting)

---

## Installation

### Step 1: Copy to Your Project

```
your-project/
├── bmad-universal/     ← Copy entire folder here
│   ├── ORCHESTRATOR.md
│   ├── agents/
│   ├── workflows/
│   └── ...
├── src/
├── package.json
└── ...
```

### Step 2: Configure (Optional)

Edit `bmad-universal/config.yaml`:

```yaml
project_name: "Your Project Name"
user_name: "Your Name"
output_folder: "docs"
language: "English"
skill_level: "intermediate"  # beginner, intermediate, advanced
default_track: "bmad-method"  # quick-flow, bmad-method, enterprise
```

### Step 3: Activate

Tell your AI agent:
```
"Read bmad-universal/ORCHESTRATOR.md and follow its instructions"
```

That's it! You're ready to go.

---

## IDE-Specific Setup

### Kiro

**Option A: Steering File (Recommended)**

Create `.kiro/steering/bmad.md`:

```markdown
---
inclusion: always
---

# BMAD Universal Framework

You are operating with the BMAD Universal development framework.

## Critical Instructions

1. Load and follow: `bmad-universal/ORCHESTRATOR.md`
2. Use intent-based routing to select agents automatically
3. Announce agent switches: 🤖 **[Agent]** ([Role]) is now active
4. Maintain agent persona until intent shifts or user requests change

## Agent Selection

Analyze user intent (not keywords) to route:
- Planning/requirements → PM
- System design → Architect  
- Implementation → Developer
- Testing → TEA
- And so on per ORCHESTRATOR.md

## Key Files
- Orchestrator: `bmad-universal/ORCHESTRATOR.md`
- Agents: `bmad-universal/agents/`
- Workflows: `bmad-universal/workflows/`
- Templates: `bmad-universal/templates/`
```

**Option B: Manual Activation**

At conversation start:
```
"Load bmad-universal/ORCHESTRATOR.md and use it for this session"
```

---

### Cursor

Create `.cursor/rules/bmad.mdc`:

```markdown
---
description: BMAD Universal Framework
globs: ["**/*"]
---

# BMAD Universal

Load and follow `bmad-universal/ORCHESTRATOR.md` for all development tasks.

## Behavior
- Auto-detect user intent and route to appropriate agent
- Announce agent switches with emoji and name
- Follow agent personas from `bmad-universal/agents/`
- Use workflows from `bmad-universal/workflows/`

## Intent Examples
- "build/implement/code" → Developer
- "design/architect/structure" → Architect
- "requirements/features/prd" → PM
- "test/quality/coverage" → TEA
```

---

### Windsurf

Create `.windsurf/rules/bmad.md`:

```markdown
# BMAD Universal Framework

Reference: bmad-universal/ORCHESTRATOR.md

## Instructions
1. Analyze user intent for every message
2. Route to appropriate specialist agent
3. Maintain agent persona during task
4. Hand off smoothly when intent changes

## Agents Available
See bmad-universal/agents/ for full roster
```

---

### Claude Code (claude.ai or API)

Add to your system prompt or first message:

```
You are using the BMAD Universal framework. 

Load and follow the instructions in bmad-universal/ORCHESTRATOR.md

This framework provides:
- 17 specialist agents for different tasks
- Intent-based automatic agent selection
- Structured workflows for software development

Analyze my intent and route to the appropriate agent automatically.
```

---

### Warp Terminal

**Global Rules:** Add to `~/.warp/rules/bmad.md`

**Project-Specific:** Add to your project's `WARP.md`:

```markdown
## BMAD Universal

This project uses BMAD Universal framework.

Reference: bmad-universal/ORCHESTRATOR.md

Activate agents with natural language - intent detection handles routing.
```

---

### GitHub Copilot

Create `.github/copilot-instructions.md`:

```markdown
# BMAD Universal Framework

This project uses BMAD Universal for AI-assisted development.

## Instructions
- Reference bmad-universal/ORCHESTRATOR.md for agent routing
- Use intent detection to select appropriate specialist
- Follow workflows in bmad-universal/workflows/
- Use templates from bmad-universal/templates/

## Available Agents
PM, Analyst, Architect, SM, Developer, TEA, UX Designer, Tech Writer, Quick Flow, and creative agents.
```

---

### Generic / Other AI Agents

Start your conversation with:

```
I'm using the BMAD Universal framework for this project.

Please read bmad-universal/ORCHESTRATOR.md and follow its instructions.

Key points:
1. Analyze my intent to select the right specialist agent
2. Announce which agent is active
3. Stay in character until my intent shifts
4. Use workflows and templates from the bmad-universal folder

Let's begin!
```

---

## Understanding Intent-Based Routing

### How It Works

BMAD Universal uses **semantic intent detection**, not keyword matching.

**Traditional (keyword-based):**
```
"create PRD" → PM (matches "PRD" keyword)
```

**BMAD Universal (intent-based):**
```
"I need to figure out what this app should do" → PM
"What features would make users happy?" → PM
"Let's define the product" → PM
```

All three route to PM because the **intent** is defining requirements.

### Intent Categories

| Intent | Description | Routes To |
|--------|-------------|-----------|
| **Discovery** | Exploring, uncertain, researching | Analyst, Brainstorm Coach |
| **Definition** | Specifying, documenting, planning | PM |
| **Design** | Architecting, structuring, tech decisions | Architect |
| **Experience** | User focus, interfaces, interactions | UX Designer |
| **Organization** | Breaking down, prioritizing, sequencing | SM |
| **Implementation** | Building, coding, creating | Developer |
| **Validation** | Testing, verifying, quality checking | TEA |
| **Documentation** | Writing, explaining, documenting | Tech Writer |
| **Rapid** | Quick fixes, small features | Quick Flow |

### Confidence Levels

The orchestrator operates at different confidence levels:

**High (>85%)** - Switches silently
```
You: "Implement the login feature"
AI: 🤖 Developer (Amelia) is now active.
    Let me review the story and begin implementation...
```

**Medium (60-85%)** - Announces switch
```
You: "Help me with the authentication"
AI: 🤖 Based on your request, I'm bringing in Architect (Winston) 
    to help design the authentication system.
```

**Low (<60%)** - Asks for clarification
```
You: "Help me with login"
AI: I can help with login in several ways:
    1. Design the login flow → UX Designer
    2. Architect the auth system → Architect
    3. Implement the login feature → Developer
    Which would you like?
```

---

## Working with Agents

### Agent Activation Methods

**1. Auto-Routing (Recommended)**
```
"I need to define what features to build"
→ System detects planning intent → Routes to PM
```

**2. Direct Reference**
```
"@architect - Review this API design"
"Act as Developer and implement this"
```

**3. File Reference**
```
"Load agents/dev.md and implement story-003"
```

### Agent Handoffs

Agents naturally suggest handoffs:

```
PM: "PRD is complete. I recommend moving to Architect 
     for system design. Shall I hand off?"

You: "Yes"

🤖 Architect (Winston) is now active.
   I've reviewed the PRD. Let's design the system...
```

### Staying in Character

Agents maintain their persona until:
- Your intent clearly shifts to another domain
- You explicitly request a different agent
- You say "dismiss" or "exit"

### Party Mode (Multi-Agent)

Bring multiple agents together:

```
You: "Let's discuss the database design with PM and Architect"

🧙 BMAD Master: Assembling relevant experts...

📋 PM (John): From a product perspective, we need to support...

🏗️ Architect (Winston): Technically, I'd recommend PostgreSQL because...

📋 PM: But what about the reporting requirements?

🏗️ Architect: Good point. We could add a read replica for...

🧙 BMAD Master: Summary - Team recommends PostgreSQL with read replica.
```

---

## Project Workflows

### Greenfield (New Project)

**Full BMAD Method Track:**
```
Phase 1 (Optional): Analysis
├── Brainstorm ideas → Analyst/Brainstorm Coach
├── Research market → Analyst
└── Create product brief → Analyst

Phase 2 (Required): Planning
├── Create PRD → PM
└── Create UX design → UX Designer (if UI-heavy)

Phase 3 (For larger projects): Solutioning
├── Create architecture → Architect
├── Create epics/stories → PM
└── Implementation readiness → Architect

Phase 4 (Required): Implementation
├── Sprint planning → SM
├── Create story → SM
├── Implement story → Developer
├── Code review → Developer
└── Retrospective → SM (after epic)
```

**Quick Flow Track (small projects):**
```
1. Create tech spec → Quick Flow/PM
2. Implement → Quick Flow/Developer
3. Done!
```

### Brownfield (Existing Project)

```
1. Document existing code → Analyst/Tech Writer
2. Define new feature → PM
3. Design integration → Architect
4. Create stories → SM
5. Implement → Developer
```

### Bug Fix / Small Feature

```
1. Describe the issue → Quick Flow
2. Quick Flow handles spec + implementation
3. Done!
```

---

## Best Practices

### 1. Be Natural

**Good:**
```
"I'm not sure what features this app needs"
"Help me think through the user experience"
"Let's build the checkout flow"
```

**Unnecessary:**
```
"Act as PM agent and execute create-prd workflow"
```

### 2. Trust the Routing

Let the orchestrator pick agents. Override only when needed.

### 3. Follow the Flow

When an agent suggests a handoff, follow it:
```
Architect: "Architecture complete. Ready for sprint planning?"
You: "Yes, let's do it"
→ SM takes over naturally
```

### 4. Use Fresh Contexts

For complex workflows, start fresh conversations:
- One conversation for PRD
- New conversation for Architecture
- New conversation for each story implementation

### 5. Reference Files When Helpful

```
"Create a story using templates/story.md as the format"
"Check my PRD against checklists/prd-checklist.md"
```

### 6. Leverage Party Mode

For decisions with trade-offs:
```
"Let's get PM, Architect, and TEA to discuss the testing strategy"
```

### 7. Keep Config Updated

Update `config.yaml` as your project evolves.

---

## Advanced Usage

### Custom Agents

Use BMAD Builder to create project-specific agents:

```
"I need a custom agent for API design"
→ Builder creates agents/api-designer.md
```

### Workflow Customization

Modify workflows in `workflows/` for your process:
- Add steps
- Remove optional steps
- Adjust templates

### Template Customization

Modify templates in `templates/` for your standards:
- Add company-specific sections
- Remove unnecessary fields
- Adjust formatting

### Multi-Project Setup

For monorepos or multiple projects:
```
monorepo/
├── project-a/
│   └── bmad-universal/  ← Copy per project
├── project-b/
│   └── bmad-universal/
└── shared/
```

Or use a shared instance with project-specific configs.

---

## Troubleshooting

### "Agent not switching when expected"

**Solution:** Be more explicit about intent shift:
```
"I'm done with planning. Let's implement this now."
```

### "Wrong agent selected"

**Solution:** Override manually:
```
"@developer - I need you for this, not architect"
```

### "Agent lost context"

**Solution:** Re-establish context:
```
"We're working on [project]. I have a PRD at docs/PRD.md. 
 Continue with architecture design."
```

### "Workflow not found"

**Solution:** Check the workflows index:
```
"Show me available workflows from workflows/_index.md"
```

### "Template formatting issues"

**Solution:** Reference template explicitly:
```
"Use exactly the format from templates/story.md"
```

---

## Quick Reference

### Activation
```
"Read bmad-universal/ORCHESTRATOR.md and follow it"
```

### Agent Override
```
"@[agent] - [request]"
"Act as [agent]"
```

### Party Mode
```
"Let's discuss with [agent1] and [agent2]"
"Get the team together"
```

### Exit Agent
```
"Dismiss"
"Exit"
"Switch to [other agent]"
```

### Check Status
```
"What agent is active?"
"What's the current workflow status?"
```

---

## Summary

1. **Copy** bmad-universal/ to your project
2. **Configure** your IDE (see IDE-specific setup)
3. **Talk naturally** - intent detection handles routing
4. **Follow the flow** - agents guide you through development
5. **Use party mode** for complex decisions

The framework adapts to you, not the other way around. Just describe what you need and let the agents help you build it.

---

**Questions?** Check the BMAD Discord: https://discord.gg/gk8jAdXWmj

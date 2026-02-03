# BMAD Universal Integration Guide

**How to integrate BMAD Universal with any AI coding tool**

---

## Quick Start (30 seconds)

1. Copy `bmad-universal/` folder to your project
2. Tell your AI: **"Read bmad-universal/ORCHESTRATOR.md and follow it"**
3. Start working - agents activate automatically based on your intent

That's it! No installation, no configuration required.

---

## Integration Methods by IDE/Tool

### Method 1: Steering/Rules Files (Recommended)

Most AI IDEs support "steering" or "rules" files that are automatically loaded. This enables automatic agent routing without manual prompting.

#### Kiro

Create `.kiro/steering/bmad.md`:

```markdown
---
inclusion: always
---

# BMAD Universal Framework Active

Load and follow all instructions in: bmad-universal/ORCHESTRATOR.md

This enables:
- Automatic intent-based agent routing
- 17 expert specialist agents
- Complete SDLC workflow coverage
- Seamless agent handoffs

**CRITICAL:** For every user message, automatically:
1. Detect the user's intent
2. Select and activate the appropriate agent
3. Load the agent file from bmad-universal/agents/
4. Fully embody the agent's persona and expertise
```

#### Cursor

Create `.cursor/rules/bmad.md`:

```markdown
# BMAD Universal Framework

Always reference bmad-universal/ORCHESTRATOR.md for agent routing.

**Auto-Activation Protocol:**
- Analyze every user message for intent
- Automatically load and embody the appropriate agent
- Announce agent switches: 🤖 **[Agent Name]** ([Role]) is now active
- Follow agent workflows and principles

No manual agent loading required - detect intent and activate automatically.
```

#### Windsurf

Create `.windsurf/rules/bmad.md`:

```markdown
# BMAD Universal Framework

Load bmad-universal/ORCHESTRATOR.md and follow its intent-based routing system.

**Automatic Agent Activation:**
- Every message triggers intent detection
- Auto-select and load appropriate agent
- Fully embody agent persona
- Seamless handoffs between agents

Intent detection is automatic - no user prompting needed.
```

#### Claude Code / Claude Desktop

Add to `.claude/settings.json` or mention at conversation start:

```json
{
  "customInstructions": "Load and follow bmad-universal/ORCHESTRATOR.md. Automatically detect user intent and activate appropriate specialist agents without requiring manual prompting. Fully embody each agent's persona."
}
```

Or simply say:
```
"Read bmad-universal/ORCHESTRATOR.md and follow it. 
Automatically activate agents based on my intent."
```

#### Warp Terminal

Create `WARP.md` in project root or add to `~/.warp/rules/`:

```markdown
# BMAD Universal Active

Reference: bmad-universal/ORCHESTRATOR.md

**Auto-Routing Enabled:**
- Intent detection on every message
- Automatic agent activation
- Full agent embodiment
- No manual loading required
```

#### GitHub Copilot

Create `.github/copilot-instructions.md`:

```markdown
# BMAD Universal Framework

Follow bmad-universal/ORCHESTRATOR.md for intent-based agent routing.

Automatically detect user intent and activate specialist agents:
- Load agent files from bmad-universal/agents/
- Fully embody agent personas
- Follow agent workflows
- Seamless transitions
```

#### Cline / Aider / Other CLI Tools

Add to project `.clinerules` or `.aider.conf.yml`:

```yaml
# BMAD Universal
instructions: |
  Load and follow bmad-universal/ORCHESTRATOR.md
  Automatically detect intent and activate agents
  Full agent embodiment required
  No manual prompting needed
```

---

### Method 2: Manual Activation (Fallback)

If your AI tool doesn't support automatic rules/steering:

**At the start of each conversation:**
```
"Read bmad-universal/ORCHESTRATOR.md and follow it. 
Automatically activate agents based on my intent without me asking."
```

**Then just start working:**
```
"I need to build a task management app"
→ AI automatically activates Analyst or PM
```

---

## Verification

Test that auto-routing is working:

### Test 1: Requirements Intent
```
You: "I need to define the features for my app"
Expected: 🤖 **PM (John)** (Product Manager) is now active.
```

### Test 2: Architecture Intent
```
You: "How should I structure the database?"
Expected: 🤖 **Architect (Winston)** (System Architect) is now active.
```

### Test 3: Implementation Intent
```
You: "Let's build the login feature"
Expected: 🤖 **Developer (Amelia)** (Senior Software Engineer) is now active.
```

### Test 4: Testing Intent
```
You: "I need to write tests for this"
Expected: 🤖 **TEA (Murat)** (Test Architect) is now active.
```

If agents activate automatically without you explicitly requesting them, **auto-routing is working!**

---

## Configuration

Edit `bmad-universal/config.yaml` for your project:

```yaml
project_name: "My Project"
user_name: "Your Name"
output_folder: "docs"
language: "English"
```

---

## Usage Patterns

### Pattern 1: Natural Conversation (Recommended)

Just describe what you need - agents activate automatically:

```
"I want to build a task management app"
→ Analyst activates for exploration

"Let's define the requirements"
→ PM activates for PRD creation

"Design the system architecture"
→ Architect activates for design

"Implement the first story"
→ Developer activates for coding
```

### Pattern 2: Direct Agent Request

Override automatic routing when needed:

```
"@architect - Review this design"
"Act as TEA and review my tests"
"Load agents/pm.md"
```

### Pattern 3: Party Mode

Multiple agents for complex decisions:

```
"Let's discuss the architecture with PM, Architect, and Developer"
→ Party Mode activates with 3 agents
```

---

## Troubleshooting

### Agent Not Activating Automatically?

**Check:**
1. Is the steering/rules file in the correct location?
2. Does your AI tool support automatic rules loading?
3. Try manual activation: "Read bmad-universal/ORCHESTRATOR.md"

**Solution:**
Use Method 2 (Manual Activation) at the start of each conversation.

### Wrong Agent Activated?

**Override manually:**
```
"@[correct-agent-name] - I need help with [task]"
```

**Or clarify intent:**
```
"I meant I want to [specific goal]"
→ AI will switch to correct agent
```

### Agent Not Fully Embodying Persona?

**Remind the AI:**
```
"Fully embody the [Agent Name] persona from agents/[agent-name].md"
```

### Need General Help Without Agent?

**Dismiss agent mode:**
```
"dismiss" or "exit agent mode"
```

---

## Best Practices

### 1. Let Auto-Routing Work

Don't overthink it - just describe what you need:
- ✅ "I need to figure out what features to build"
- ❌ "Load agents/pm.md and create a PRD"

### 2. Trust Agent Handoffs

Agents will naturally hand off to each other:
- PM creates PRD → suggests Architect
- Architect designs → suggests SM for stories
- SM creates story → suggests Developer

### 3. Use Party Mode for Big Decisions

When you need multiple perspectives:
```
"Let's discuss this approach with the team"
```

### 4. Keep Context Fresh

For best results:
- Start new conversations for new workflows
- Reference specific files when needed
- Let agents load their own context

---

## Advanced: Custom Integration

### Create Your Own Steering File

Template for any AI tool:

```markdown
# BMAD Universal - [Your Tool Name]

Load: bmad-universal/ORCHESTRATOR.md

## Auto-Activation Rules

For every user message:
1. Detect intent (not keywords)
2. Select agent from bmad-universal/agents/
3. Announce: 🤖 **[Agent]** ([Role]) is now active
4. Load agent file completely
5. Fully embody persona
6. Execute workflows

## Agent Selection

- Requirements → PM (agents/pm.md)
- Architecture → Architect (agents/architect.md)
- Implementation → Developer (agents/dev.md)
- Testing → TEA (agents/tea.md)
- UX → UX Designer (agents/ux-designer.md)
- Research → Analyst (agents/analyst.md)
- Sprint → SM (agents/sm.md)
- Docs → Tech Writer (agents/tech-writer.md)
- Quick fixes → Quick Flow (agents/quick-flow-solo-dev.md)

## Remember

- Proactive, not reactive
- Intent over keywords
- Full embodiment required
- Seamless transitions
```

---

## File Locations Reference

```
bmad-universal/
├── ORCHESTRATOR.md          ← Main routing logic (load this)
├── INTEGRATION-GUIDE.md     ← This file
├── config.yaml              ← Project configuration
├── agents/                  ← 17 specialist agents
│   ├── pm.md
│   ├── analyst.md
│   ├── architect.md
│   ├── dev.md
│   ├── tea.md
│   └── ... (12 more)
├── workflows/               ← 25 workflow guides
├── knowledge/               ← 30 knowledge files
├── templates/               ← 14 templates
└── checklists/              ← 16 checklists
```

---

## Support

**Not working?**
1. Check your AI tool's documentation for rules/steering support
2. Try manual activation method
3. Verify file paths are correct
4. Test with simple intent: "I need to create a PRD"

**Working perfectly?**
Enjoy automatic agent routing and seamless SDLC workflows! 🚀

---

**BMAD Universal is designed to work universally with any AI coding tool. The framework adapts to your environment, not the other way around.**

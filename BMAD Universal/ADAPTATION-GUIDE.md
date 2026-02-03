# BMAD Universal Adaptation Guide

**How to adapt new BMAD-METHOD updates to BMAD Universal**

This guide ensures you can manually update BMAD Universal when new versions of the original BMAD-METHOD are released, while preserving the universal, zero-installation philosophy.

---

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Transformation Principles](#transformation-principles)
3. [Update Process](#update-process)
4. [File Mapping](#file-mapping)
5. [Adaptation Rules](#adaptation-rules)
6. [Testing & Validation](#testing--validation)

---

## Core Philosophy

### BMAD Universal Purpose

**Mission:** Transform BMAD-METHOD into a zero-installation, universal framework that works with any AI IDE while maintaining 100% functional equivalence.

**Core Principles:**
1. **Zero Installation** - No Node.js, no npm, no dependencies
2. **Universal Compatibility** - Works with any AI IDE
3. **Markdown-Based** - All files in readable markdown format
4. **Consolidated Structure** - Single-file workflows, standalone resources
5. **Automatic Routing** - Intent-based agent activation built-in
6. **Single Source of Truth** - ORCHESTRATOR.md contains all routing logic

**What We Keep:**
- ✅ All core functionality
- ✅ Complete SDLC coverage
- ✅ Agent personas and expertise
- ✅ Workflow guidance
- ✅ Testing frameworks
- ✅ Documentation templates

**What We Transform:**
- 🔄 YAML agents → Markdown agents
- 🔄 XML workflows → Consolidated markdown workflows
- 🔄 npm installation → Copy & use
- 🔄 CLI tools → Manual processes
- 🔄 Embedded knowledge → Standalone files
- 🔄 Step-based workflows → Single-file workflows

**What We Exclude (By Design):**
- ❌ Node.js/npm dependencies
- ❌ CLI automation tools
- ❌ Module system
- ❌ XML orchestration
- ❌ Excalidraw diagrams (use Mermaid instead)
- ❌ Build/bundling tools

---

## Transformation Principles

### 1. Agent Transformation

**Original Format (YAML):**
```yaml
# analyst.agent.yaml
agent:
  metadata:
    id: "_bmad/bmm/agents/analyst.md"
    name: Mary
    title: Business Analyst
  persona:
    role: Strategic Business Analyst
    principles: |
      - Principle 1
      - Principle 2
  menu:
    - trigger: BP
      exec: "{project-root}/_bmad/core/workflows/brainstorming/workflow.md"
```

**BMAD Universal Format (Markdown):**
```markdown
# Analyst (Mary) - Strategic Business Analyst

## Role
Strategic Business Analyst + Requirements Expert

## Persona
Senior analyst with deep expertise in market research...

## Principles
- Principle 1
- Principle 2

## Workflows
- `*brainstorm` - Guided ideation
- `*research` - Domain/market/technical research
```

**Transformation Rules:**
- Extract persona, role, principles from YAML
- Convert menu triggers to workflow references
- Add communication style and expertise
- Remove technical metadata
- Make human-readable

### 2. Workflow Transformation

**Original Format (Multi-Step + XML):**
```
workflows/1-analysis/research/
├── workflow.xml              # Orchestration
├── workflow.md               # Overview
├── step-01-init.md
├── step-02-domain-analysis.md
├── step-03-competitive-landscape.md
├── step-04-regulatory-focus.md
├── step-05-technical-trends.md
└── step-06-research-synthesis.md
```

**BMAD Universal Format (Single File):**
```markdown
# Research Workflow

## Overview
Complete research workflow for domain, market, and technical analysis.

## Step 1: Initialize
[Content from step-01-init.md]

## Step 2: Domain Analysis
[Content from step-02-domain-analysis.md]

## Step 3: Competitive Landscape
[Content from step-03-competitive-landscape.md]

...

## Step 6: Research Synthesis
[Content from step-06-research-synthesis.md]
```

**Transformation Rules:**
- Consolidate all steps into single markdown file
- Remove XML orchestration (AI manages flow)
- Preserve all content and guidance
- Add clear section headers
- Include complete workflow context

### 3. Knowledge Extraction

**Original:** Knowledge embedded in workflow steps

**BMAD Universal:** Standalone knowledge files in `knowledge/`

**Transformation Rules:**
- Extract reusable patterns into separate files
- Create index file (`knowledge/_index.md`)
- Organize by category (architecture, testing, debugging, etc.)
- Make independently referenceable
- Add usage guidance

### 4. Template Extraction

**Original:** Templates embedded in workflows

**BMAD Universal:** Standalone templates in `templates/`

**Transformation Rules:**
- Extract all document templates
- Create standalone markdown files
- Add clear structure and placeholders
- Make independently usable
- Reference from workflows

### 5. Checklist Extraction

**Original:** Checklists embedded in workflows

**BMAD Universal:** Standalone checklists in `checklists/`

**Transformation Rules:**
- Extract validation checklists
- Create standalone markdown files
- Organize by workflow/phase
- Make independently referenceable
- Add clear criteria

---

## Update Process

### Step 1: Download New BMAD-METHOD Version

```bash
# Download latest release
cd ~/Downloads
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD
git checkout [latest-version-tag]
```

### Step 2: Identify Changes

**Check these locations:**
```
BMAD-METHOD/
├── CHANGELOG.md              # What's new
├── src/bmm/agents/           # Agent updates
├── src/bmm/workflows/        # Workflow updates
└── package.json              # Version info
```

**Key Questions:**
- Are there new agents?
- Are there new workflows?
- Are there updated agent personas?
- Are there new knowledge/patterns?
- Are there new templates?

### Step 3: Map Changes to BMAD Universal

Use the [File Mapping](#file-mapping) section below to determine where changes should go.

### Step 4: Transform Content

Apply [Transformation Principles](#transformation-principles) to convert:
- YAML agents → Markdown agents
- Multi-step workflows → Single-file workflows
- Embedded knowledge → Standalone files
- XML orchestration → Markdown guidance

### Step 5: Update Core Files

**Always update these:**
- `VERSION.yaml` - Update version numbers
- `CHANGELOG.md` - Document what changed
- `README.md` - Update if major features added
- `AGENTS.md` - Update if agents changed
- `workflows/_index.md` - Update if workflows changed
- `knowledge/_index.md` - Update if knowledge added

### Step 6: Test & Validate

Follow [Testing & Validation](#testing--validation) section.

---

## File Mapping

### Original → BMAD Universal Mapping

| Original Location | BMAD Universal Location | Transformation |
|-------------------|-------------------------|----------------|
| **Agents** |
| `src/bmm/agents/*.agent.yaml` | `agents/*.md` | YAML → Markdown |
| `src/bmm/agents/tech-writer/` | `agents/tech-writer.md` | Folder → Single file |
| **Workflows** |
| `src/bmm/workflows/1-analysis/*/` | `workflows/1-analysis/*.md` | Multi-step → Single file |
| `src/bmm/workflows/2-plan-workflows/*/` | `workflows/2-planning/*.md` | Multi-step → Single file |
| `src/bmm/workflows/3-solutioning/*/` | `workflows/3-solutioning/*.md` | Multi-step → Single file |
| `src/bmm/workflows/4-implementation/*/` | `workflows/4-implementation/*.md` | Multi-step → Single file |
| `src/bmm/workflows/testarch/*/` | `workflows/testing/*.md` | Multi-step → Single file |
| `src/bmm/workflows/bmad-quick-flow/*/` | `workflows/quick-flow/*.md` | Multi-step → Single file |
| `src/bmm/workflows/excalidraw-diagrams/*/` | `workflows/diagrams/create-diagram.md` | Excalidraw → Mermaid |
| **Knowledge** |
| Embedded in workflow steps | `knowledge/*.md` | Extract → Standalone |
| **Templates** |
| Embedded in workflows | `templates/*.md` | Extract → Standalone |
| **Checklists** |
| Embedded in workflows | `checklists/*.md` | Extract → Standalone |
| **Configuration** |
| `package.json` | `config.yaml` | npm config → Simple YAML |
| **Documentation** |
| `README.md` | `README.md` | Adapt for zero-install |
| `CHANGELOG.md` | `CHANGELOG.md` | Adapt for BMAD Universal |
| **Excluded** |
| `tools/` | ❌ Not included | CLI tools excluded |
| `test/` | ❌ Not included | Test suites excluded |
| `website/` | ❌ Not included | Docs site excluded |
| `.github/workflows/` | ❌ Not included | CI/CD excluded |

---

## Adaptation Rules

### Rule 1: Preserve Functional Equivalence

**Goal:** Every workflow, agent, and feature in original BMAD must have equivalent in BMAD Universal.

**How:**
- Map every agent → Create markdown agent
- Map every workflow → Create consolidated workflow
- Map every template → Create standalone template
- Map every checklist → Create standalone checklist

**Exception:** CLI tools, build systems, and npm-specific features are excluded by design.

### Rule 2: Consolidate, Don't Fragment

**Goal:** Reduce file count while preserving content.

**How:**
- Multi-step workflows → Single markdown file
- Embedded knowledge → Standalone files (but fewer than original)
- Scattered templates → Organized templates folder
- Multiple agent files → Single agent file per agent

**Example:**
```
Original: 6 files for research workflow
Universal: 1 file (workflows/1-analysis/research.md)
```

### Rule 3: Markdown Everything

**Goal:** All content in readable markdown format.

**How:**
- YAML agents → Markdown agents
- XML workflows → Markdown workflows
- JSON configs → YAML configs (simpler)
- No binary files (except .gitkeep)

**Exception:** `config.yaml` and `VERSION.yaml` remain YAML for structure.

### Rule 4: Zero Dependencies

**Goal:** No installation required.

**How:**
- Remove all npm dependencies
- Remove Node.js requirements
- Remove CLI tools
- Remove build processes
- Pure markdown + YAML only

**Test:** Can you copy folder and use immediately? If no, it violates this rule.

### Rule 5: Universal Compatibility

**Goal:** Works with any AI IDE.

**How:**
- No IDE-specific files in framework
- All logic in ORCHESTRATOR.md
- Steering files are examples, not requirements
- Markdown is universally readable

**Test:** Can it work with a new AI tool without modification? If no, it violates this rule.

### Rule 6: Single Source of Truth

**Goal:** ORCHESTRATOR.md contains all routing logic.

**How:**
- All agent selection logic in ORCHESTRATOR.md
- All intent detection in ORCHESTRATOR.md
- All activation protocols in ORCHESTRATOR.md
- Steering files just reference ORCHESTRATOR.md

**Test:** If you update routing logic, do you only need to update ORCHESTRATOR.md? If no, it violates this rule.

### Rule 7: Maintain Agent Personas

**Goal:** Preserve the personality and expertise of each agent.

**How:**
- Keep agent names and roles
- Preserve communication styles
- Maintain principles and expertise
- Adapt workflows to markdown format

**Test:** Does the agent feel like the same expert? If no, it violates this rule.

### Rule 8: Complete Workflows

**Goal:** Every workflow must be complete and self-contained.

**How:**
- Include all steps in single file
- Provide complete context
- Add clear section headers
- Include examples and guidance

**Test:** Can someone follow the workflow from start to finish in one file? If no, it violates this rule.

---

## Detailed Adaptation Process

### Adapting a New Agent

**Step 1: Locate Original Agent**
```bash
cd BMAD-METHOD/src/bmm/agents/
cat new-agent.agent.yaml
```

**Step 2: Extract Key Information**
- Agent name and role
- Persona description
- Principles
- Communication style
- Menu items (workflows)

**Step 3: Create Markdown Agent**
```markdown
# [Agent Name] ([Persona Name]) - [Role]

## Role
[Extract from agent.persona.role]

## Persona
[Extract from agent.persona.identity]

## Communication Style
[Extract from agent.persona.communication_style]

## Principles
[Extract from agent.persona.principles]

## Workflows
[Convert menu items to workflow references]

## When to Activate
[Describe intent triggers]
```

**Step 4: Add to Agent Index**
Update `agents/_index.md` with new agent.

**Step 5: Update ORCHESTRATOR.md**
Add agent to Agent Selection Matrix.

**Step 6: Update AGENTS.md**
Add agent to quick reference.

### Adapting a New Workflow

**Step 1: Locate Original Workflow**
```bash
cd BMAD-METHOD/src/bmm/workflows/
ls -la [workflow-category]/[workflow-name]/
```

**Step 2: Read All Step Files**
```bash
cat workflow.md
cat step-01-*.md
cat step-02-*.md
# ... etc
```

**Step 3: Consolidate into Single File**
```markdown
# [Workflow Name]

## Overview
[Content from workflow.md]

## Prerequisites
[List any requirements]

## Step 1: [Step Name]
[Content from step-01-*.md]

## Step 2: [Step Name]
[Content from step-02-*.md]

...

## Completion
[Final step content]

## Outputs
[What this workflow produces]

## Next Steps
[What to do after this workflow]
```

**Step 4: Extract Knowledge**
If workflow contains reusable patterns:
- Create `knowledge/[pattern-name].md`
- Reference from workflow
- Add to `knowledge/_index.md`

**Step 5: Extract Templates**
If workflow contains templates:
- Create `templates/[template-name].md`
- Reference from workflow

**Step 6: Extract Checklists**
If workflow contains checklists:
- Create `checklists/[checklist-name].md`
- Reference from workflow

**Step 7: Add to Workflow Index**
Update `workflows/_index.md` with new workflow.

**Step 8: Update Agent Files**
Add workflow reference to relevant agent(s).

### Adapting New Knowledge

**Step 1: Identify Knowledge**
Look for reusable patterns in workflow steps.

**Step 2: Extract to Standalone File**
```markdown
# [Knowledge Topic]

## Overview
[What this knowledge covers]

## When to Use
[Scenarios where this applies]

## Pattern/Approach
[Detailed explanation]

## Examples
[Code examples, if applicable]

## Best Practices
[Guidelines and recommendations]

## Common Pitfalls
[What to avoid]

## Related Knowledge
[Links to related files]
```

**Step 3: Add to Knowledge Index**
Update `knowledge/_index.md` with:
- File name
- Description
- Use cases
- Category

**Step 4: Reference from Workflows**
Update relevant workflows to reference this knowledge file.

### Adapting New Templates

**Step 1: Identify Template**
Look for document structures in workflows.

**Step 2: Extract to Standalone File**
```markdown
# [Template Name]

## Purpose
[What this template is for]

## When to Use
[Scenarios for this template]

## Template Structure

### Section 1: [Name]
[Guidance and placeholders]

### Section 2: [Name]
[Guidance and placeholders]

...

## Example
[Optional: filled-in example]

## Tips
[Guidance for using this template]
```

**Step 3: Reference from Workflows**
Update relevant workflows to reference this template.

### Adapting New Checklists

**Step 1: Identify Checklist**
Look for validation criteria in workflows.

**Step 2: Extract to Standalone File**
```markdown
# [Checklist Name]

## Purpose
[What this checklist validates]

## When to Use
[At what stage/phase]

## Checklist Items

### Category 1: [Name]
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Category 2: [Name]
- [ ] Criterion 1
- [ ] Criterion 2

...

## Scoring
[Optional: how to score/evaluate]

## Next Steps
[What to do based on results]
```

**Step 3: Reference from Workflows**
Update relevant workflows to reference this checklist.

---

## Testing & Validation

### Validation Checklist

After adapting updates, verify:

#### ✅ Structural Integrity
- [ ] All agents have markdown files in `agents/`
- [ ] All workflows are consolidated in `workflows/`
- [ ] All knowledge files are in `knowledge/`
- [ ] All templates are in `templates/`
- [ ] All checklists are in `checklists/`
- [ ] Index files are updated

#### ✅ Content Completeness
- [ ] No content lost from original
- [ ] All steps included in workflows
- [ ] All agent personas preserved
- [ ] All principles maintained
- [ ] All examples included

#### ✅ Functional Equivalence
- [ ] Every original workflow has equivalent
- [ ] Every original agent has equivalent
- [ ] Every original template has equivalent
- [ ] All core functionality preserved

#### ✅ Format Compliance
- [ ] All files are markdown (except config.yaml, VERSION.yaml)
- [ ] No YAML agent files
- [ ] No XML workflow files
- [ ] No npm dependencies
- [ ] No Node.js requirements

#### ✅ Universal Compatibility
- [ ] No IDE-specific files in framework
- [ ] ORCHESTRATOR.md contains all routing logic
- [ ] Steering files are examples only
- [ ] Works with manual activation

#### ✅ Documentation Updates
- [ ] VERSION.yaml updated
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if needed)
- [ ] AGENTS.md updated (if agents changed)
- [ ] Index files updated

### Testing Process

#### Test 1: Manual Activation
```
Tell AI: "Read bmad-universal/ORCHESTRATOR.md and follow it"
Then: "I need to [test new feature]"
Expected: Appropriate agent activates
```

#### Test 2: Agent Activation
Test each new/updated agent:
```
"I need to [agent's domain]"
Expected: Correct agent activates with full persona
```

#### Test 3: Workflow Execution
Test each new/updated workflow:
```
"Follow the [workflow-name] workflow"
Expected: AI can follow complete workflow from single file
```

#### Test 4: Knowledge Reference
Test new knowledge files:
```
"Load knowledge/[new-file].md for guidance"
Expected: AI can access and apply knowledge
```

#### Test 5: Template Usage
Test new templates:
```
"Use templates/[new-template].md to create [document]"
Expected: AI can use template successfully
```

#### Test 6: Cross-IDE Compatibility
Test with multiple AI tools:
- [ ] Kiro
- [ ] Cursor
- [ ] Windsurf
- [ ] Claude Code
- [ ] Manual activation

Expected: Works consistently across all tools

---

## Version Management

### Update VERSION.yaml

```yaml
# Current version of this bmad-universal instance
version: "[new-version]"

# The upstream BMAD-METHOD version this is based on
based_on: "BMAD-METHOD v[original-version]"

# Last update date
last_updated: "[YYYY-MM-DD]"
```

### Update CHANGELOG.md

```markdown
## [New Version] - YYYY-MM-DD

### Overview
Brief description of what changed in this update.

### New Features
- New agent: [Agent Name]
- New workflow: [Workflow Name]
- Enhanced: [What was enhanced]

### Files Created
- `agents/[new-agent].md`
- `workflows/[new-workflow].md`
- `knowledge/[new-knowledge].md`

### Files Modified
- `ORCHESTRATOR.md` - Added [agent] routing
- `AGENTS.md` - Added [agent] reference
- `workflows/_index.md` - Added [workflow]

### Transformation Notes
- [How original content was adapted]
- [Any special considerations]
```

---

## Common Scenarios

### Scenario 1: New Agent Added to Original

**Original:** `src/bmm/agents/new-agent.agent.yaml`

**Steps:**
1. Read YAML file
2. Extract persona, role, principles
3. Create `agents/new-agent.md` in markdown
4. Add to `agents/_index.md`
5. Add to ORCHESTRATOR.md Agent Selection Matrix
6. Add to AGENTS.md quick reference
7. Test activation

### Scenario 2: Workflow Updated in Original

**Original:** `src/bmm/workflows/[category]/[workflow]/step-*.md` files updated

**Steps:**
1. Read all updated step files
2. Update corresponding section in `workflows/[category]/[workflow].md`
3. Preserve consolidation (single file)
4. Test workflow execution

### Scenario 3: New Workflow Added to Original

**Original:** `src/bmm/workflows/[category]/[new-workflow]/`

**Steps:**
1. Read all step files
2. Create `workflows/[category]/[new-workflow].md`
3. Consolidate all steps into single file
4. Extract any knowledge/templates/checklists
5. Add to `workflows/_index.md`
6. Add to relevant agent files
7. Test workflow execution

### Scenario 4: New Knowledge Pattern in Original

**Original:** Pattern embedded in workflow steps

**Steps:**
1. Identify reusable pattern
2. Create `knowledge/[pattern-name].md`
3. Add to `knowledge/_index.md`
4. Reference from relevant workflows
5. Test knowledge loading

### Scenario 5: Agent Persona Updated in Original

**Original:** `src/bmm/agents/[agent].agent.yaml` persona section changed

**Steps:**
1. Read updated persona
2. Update `agents/[agent].md` persona section
3. Preserve markdown format
4. Test agent activation and behavior

### Scenario 6: New Module Released

**Original:** New optional module (e.g., Game Dev Studio)

**Decision:** Evaluate if module should be integrated or remain separate.

**If Integrating:**
1. Extract agents from module
2. Convert to markdown format
3. Add to `agents/` folder
4. Update ORCHESTRATOR.md
5. Update AGENTS.md
6. Maintain zero-installation principle

**If Keeping Separate:**
- Document in README.md as optional extension
- Provide integration instructions

---

## Preservation Guidelines

### What Must Be Preserved

1. **Agent Expertise**
   - Persona descriptions
   - Principles
   - Communication styles
   - Domain knowledge

2. **Workflow Guidance**
   - All steps and instructions
   - Examples and templates
   - Best practices
   - Common pitfalls

3. **Knowledge Content**
   - Patterns and approaches
   - Code examples
   - Best practices
   - Anti-patterns

4. **Functional Completeness**
   - Every workflow must work end-to-end
   - Every agent must be fully functional
   - All SDLC phases covered

### What Can Be Adapted

1. **File Structure**
   - Multi-step → Single file
   - Embedded → Standalone
   - YAML → Markdown
   - XML → Markdown

2. **Technical Implementation**
   - Remove npm dependencies
   - Remove CLI tools
   - Remove build processes
   - Simplify configuration

3. **Orchestration**
   - XML orchestration → AI-managed flow
   - State management → AI context
   - Step-by-step control → Complete workflow

### What Must Be Excluded

1. **Installation Requirements**
   - Node.js dependencies
   - npm packages
   - Build tools
   - CLI utilities

2. **IDE-Specific Features**
   - IDE-specific configurations
   - IDE-specific integrations
   - Platform-specific code

3. **Automation Tools**
   - Build scripts
   - Test runners
   - Bundlers
   - Validators

---

## Quality Standards

### Markdown Quality

- ✅ Clear headers and structure
- ✅ Proper formatting (lists, code blocks, tables)
- ✅ No broken links
- ✅ Consistent style
- ✅ Human-readable

### Content Quality

- ✅ Complete information
- ✅ Clear instructions
- ✅ Practical examples
- ✅ Best practices included
- ✅ Common pitfalls addressed

### Functional Quality

- ✅ Workflows are complete
- ✅ Agents are fully functional
- ✅ Knowledge is applicable
- ✅ Templates are usable
- ✅ Checklists are comprehensive

### Universal Quality

- ✅ Works with any AI IDE
- ✅ No installation required
- ✅ No dependencies
- ✅ Platform-independent
- ✅ Copy & use immediately

---

## Troubleshooting Adaptations

### Issue: Content Doesn't Fit Single File

**Problem:** Workflow is too large for single file

**Solution:**
- Split into logical sub-workflows
- Create multiple workflow files
- Link between workflows
- Maintain clear navigation

**Example:**
```
workflows/testing/framework.md (main)
workflows/testing/framework-setup.md (sub)
workflows/testing/framework-config.md (sub)
```

### Issue: Knowledge Too Scattered

**Problem:** Pattern appears in multiple places

**Solution:**
- Create single authoritative knowledge file
- Reference from all relevant workflows
- Add to knowledge index with clear use cases

### Issue: Agent Persona Too Complex

**Problem:** Agent has extensive sidecar files

**Solution:**
- Consolidate into single markdown file
- Organize with clear sections
- Extract reusable knowledge to knowledge/
- Keep agent file focused on persona

### Issue: Template Embedded in Workflow

**Problem:** Template is tightly coupled to workflow

**Solution:**
- Extract template to templates/
- Reference from workflow
- Make template standalone and reusable
- Add usage guidance to template

### Issue: Checklist Duplicated

**Problem:** Same checklist appears in multiple workflows

**Solution:**
- Create single checklist file
- Reference from all relevant workflows
- Add to checklists/ folder
- Update index

---

## Final Checklist

Before considering adaptation complete:

### Documentation
- [ ] VERSION.yaml updated
- [ ] CHANGELOG.md updated
- [ ] README.md reviewed (update if needed)
- [ ] AGENTS.md updated (if agents changed)
- [ ] All index files updated

### Structure
- [ ] All new agents in agents/
- [ ] All new workflows in workflows/
- [ ] All new knowledge in knowledge/
- [ ] All new templates in templates/
- [ ] All new checklists in checklists/

### Format
- [ ] All files are markdown (except config/version YAML)
- [ ] No YAML agents
- [ ] No XML workflows
- [ ] No npm dependencies
- [ ] Consistent formatting

### Functionality
- [ ] All agents activate correctly
- [ ] All workflows execute completely
- [ ] All knowledge is accessible
- [ ] All templates are usable
- [ ] All checklists are complete

### Testing
- [ ] Manual activation tested
- [ ] Agent activation tested
- [ ] Workflow execution tested
- [ ] Cross-IDE compatibility tested
- [ ] No broken references

### Philosophy
- [ ] Zero installation maintained
- [ ] Universal compatibility maintained
- [ ] Single source of truth maintained
- [ ] Functional equivalence maintained
- [ ] Simplicity preserved

---

## Summary

**BMAD Universal Adaptation Philosophy:**

1. **Preserve** - All functionality, expertise, and guidance
2. **Transform** - Format and structure for universal use
3. **Consolidate** - Reduce complexity while maintaining completeness
4. **Simplify** - Remove dependencies and installation requirements
5. **Universalize** - Ensure compatibility with any AI IDE

**Key Principle:** When in doubt, prioritize functional equivalence and universal compatibility over feature parity with technical implementation.

**Success Criteria:** Can someone copy bmad-universal folder, tell their AI to read ORCHESTRATOR.md, and immediately start using all features? If yes, adaptation is successful.

---

**Version:** 1.0.0  
**Last Updated:** January 26, 2026  
**Purpose:** Guide for adapting BMAD-METHOD updates to BMAD Universal

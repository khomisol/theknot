# Party Mode Workflow

**Goal:** Orchestrate group discussions between multiple BMAD agents, enabling natural multi-agent conversations for complex decisions and collaborative problem-solving.

**When to Use:**
- Complex decisions requiring multiple perspectives
- Cross-functional discussions (PM + Architect + Developer)
- Brainstorming sessions with diverse viewpoints
- Architectural reviews needing multiple expert opinions
- Strategic planning requiring business + technical input

---

## Overview

Party Mode brings together 2-4 specialist agents for collaborative discussions. Each agent maintains their unique personality, expertise, and communication style while contributing to a unified conversation.

---

## Activation

### Starting Party Mode

**Option 1: Natural Language**
```
"Let's discuss the authentication architecture with PM, Architect, and Developer"
"Get the team together to review this approach"
"I need PM and UX to discuss the user flow"
```

**Option 2: Direct Command**
```
*party-mode
```

**Option 3: Specific Agents**
```
"@pm @architect @developer - Let's discuss the database design"
```

---

## Agent Selection

### Automatic Selection

The orchestrator analyzes your message and selects 2-4 relevant agents based on:
- Topic domain (technical, business, creative)
- Required expertise (architecture, testing, UX)
- Conversation context
- Previous agent contributions

### Manual Selection

Specify agents explicitly:
```
"Party mode with PM, Architect, and TEA to discuss the testing strategy"
```

### Recommended Combinations

**Technical Decisions:**
- Architect + Developer + TEA
- Architect + Developer + SM

**Product Planning:**
- PM + Analyst + UX Designer
- PM + Architect + SM

**Feature Design:**
- PM + UX Designer + Developer
- PM + Architect + UX Designer

**Quality & Testing:**
- TEA + Developer + Architect
- TEA + SM + Developer

**Creative Ideation:**
- Analyst + Brainstorm Coach + Problem Solver
- PM + Innovation Strategist + Design Thinking Coach

---

## Conversation Flow

### 1. Welcome & Introduction

When party mode activates:

```
🎉 PARTY MODE ACTIVATED! 🎉

I've brought together our expert team:

🏗️ **Winston** (Architect) - System design and technical decisions
💻 **Amelia** (Developer) - Implementation and code quality
🧪 **Tessa** (TEA) - Testing strategy and quality assurance

What would you like to discuss with the team?
```

### 2. Multi-Agent Discussion

Each agent contributes based on their expertise:

**Example Flow:**
```
You: "How should we handle user authentication?"

🏗️ Winston (Architect):
"From an architectural perspective, I recommend OAuth 2.1 with PKCE for 
security. We should use JWT tokens with short expiration times..."

💻 Amelia (Developer):
"I agree with Winston. Implementation-wise, we can use Passport.js for 
Node or Spring Security for Java. We'll need to handle token refresh..."

🧪 Tessa (TEA):
"For testing, we need to cover: token generation, expiration, refresh 
flows, and invalid token handling. I recommend..."
```

### 3. Cross-Agent Interaction

Agents can reference and build on each other's points:

```
🏗️ Winston: "We should use Redis for session storage."

💻 Amelia: "Building on Winston's point, Redis also gives us pub/sub 
for real-time features if we need them later."

🧪 Tessa: "I'll need mock Redis endpoints for testing, Amelia. Can we 
add that to the test infrastructure?"
```

### 4. Questions to User

When an agent asks you a question, the conversation pauses for your response:

```
📋 John (PM): "Before we finalize this approach, I need to understand: 
What's our target user base size? This affects our scaling decisions."

[Waiting for your response...]
```

---

## Conversation Management

### Keeping Discussion Focused

If the conversation drifts:
```
"Let's refocus on the authentication approach"
"Can we get back to the database design question?"
```

### Adding More Agents

Mid-conversation:
```
"Let's bring in UX Designer to discuss the login flow"
"Add TEA to this discussion"
```

### Removing Agents

```
"Thanks Winston, we've covered the architecture. Let's continue with just PM and Developer"
```

---

## Exit Party Mode

### Natural Conclusion

When the discussion reaches a natural end:
```
"Thanks everyone, that's all I needed"
"We're done here"
"That answers my questions"
```

### Explicit Exit

```
*exit
goodbye
end party
quit
```

### Graceful Conclusion

The orchestrator will summarize key decisions and next actions before exiting.

---

## Best Practices

### 1. Start with Clear Context

**Good:**
```
"I need to decide between microservices and monolith for our e-commerce 
platform. Expected traffic: 10K users/day, team size: 5 developers. 
Let's discuss with Architect, PM, and Developer."
```

**Less Effective:**
```
"What should I build?"
```

### 2. Let Agents Interact

Don't interrupt natural agent-to-agent discussions. They often build on each other's ideas productively.

### 3. Ask Follow-Up Questions

```
"Winston, can you elaborate on the Redis approach?"
"Amelia, what's the implementation complexity for that?"
"Tessa, how would we test that scenario?"
```

### 4. Request Consensus

```
"Do we all agree on this approach?"
"Are there any concerns with this decision?"
"What's the team's recommendation?"
```

### 5. Capture Decisions

```
"Can someone summarize the key decisions we've made?"
"What are the action items from this discussion?"
```

---

## Example Scenarios

### Scenario 1: Architecture Review

```
You: "Party mode with Architect, Developer, and TEA. I need to review 
our microservices architecture for the payment system."

🏗️ Winston: "Let me review the architecture... I see potential issues 
with service boundaries and data consistency..."

💻 Amelia: "From an implementation standpoint, the inter-service 
communication needs work..."

🧪 Tessa: "For testing, we'll need contract tests between services and 
integration tests for the payment flow..."

[Discussion continues with cross-agent interaction]
```

### Scenario 2: Feature Planning

```
You: "Get PM, UX, and Developer together. We need to plan the new 
dashboard feature."

📋 John (PM): "Let's start with requirements. What problem are we 
solving for users?"

🎨 Sally (UX): "I'm thinking about the user journey. They need to see 
key metrics at a glance..."

💻 Amelia: "We can implement this with React and Chart.js. Real-time 
updates via WebSocket..."

[Discussion continues]
```

### Scenario 3: Problem Solving

```
You: "Party mode with Problem Solver, Architect, and Developer. Our 
API response times are too slow."

🔬 Dr. Quinn (Problem Solver): "Let's use root cause analysis. First, 
where exactly is the bottleneck?"

🏗️ Winston: "I suspect it's the database queries. We need to review 
our indexing strategy..."

💻 Amelia: "I can add query profiling to identify the slow queries..."

[Discussion continues with systematic problem-solving]
```

---

## Troubleshooting

### Too Many Agents Talking

```
"Let's hear from just Architect and Developer on this"
"Can we focus on PM's perspective first?"
```

### Agents Disagreeing

This is normal and valuable! Different perspectives lead to better decisions.

```
"I see different viewpoints. Can each of you explain your reasoning?"
"What are the trade-offs of each approach?"
```

### Need Different Expertise

```
"Thanks for the input. Let's bring in TEA to discuss testing"
"I need UX Designer's perspective on this"
```

### Conversation Too Long

```
"Can we summarize the key points and make a decision?"
"What's the recommended path forward?"
```

---

## Related Workflows

- `brainstorm.md` - Structured ideation with Brainstorm Coach
- `prd.md` - Requirements definition with PM
- `architecture.md` - System design with Architect
- `create-epics-stories.md` - Story breakdown with PM and SM

---

## Tips

1. **Be specific about the topic** - Clear context leads to focused discussions
2. **Let agents interact** - Cross-agent discussions often produce insights
3. **Ask for consensus** - Get alignment before making decisions
4. **Capture outcomes** - Document decisions and action items
5. **Use for complex decisions** - Simple questions don't need party mode
6. **Mix expertise levels** - Combine strategic (PM) with tactical (Developer)
7. **Time-box discussions** - Keep conversations focused and productive

---

**Party Mode transforms complex decisions into collaborative discussions, leveraging the collective expertise of your BMAD agent team.**

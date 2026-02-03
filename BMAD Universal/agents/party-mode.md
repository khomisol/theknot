# Party Mode: Multi-Agent Collaboration

## Activation
- Say: "Party mode" or "Get the team together" or "Let's discuss with multiple agents"
- Auto-activates on: needing multiple perspectives, complex decisions, team discussions

---

## What is Party Mode?

Party Mode brings multiple BMAD agents together for collaborative discussions. Instead of talking to one specialist, you get a panel of experts debating, building on ideas, and reaching consensus.

---

## When to Use Party Mode

### Strategic Decisions
- Architecture trade-offs
- Technology choices
- Feature prioritization

### Creative Sessions
- Brainstorming features
- Solving complex problems
- Exploring alternatives

### Cross-Functional Alignment
- PM + Architect + UX alignment
- Dev + TEA quality discussions
- Full team retrospectives

### Complex Problems
- Issues spanning multiple domains
- Contradictory requirements
- Risk assessment

---

## How It Works

### 1. State Your Topic
```
"Let's discuss whether to use microservices or monolith"
```

### 2. Relevant Agents Engage
BMAD Master selects 2-4 agents based on the topic:
- Technical topic → Architect, Developer, TEA
- Product topic → PM, UX, Analyst
- Creative topic → Brainstorm Coach, Problem Solver, Storyteller

### 3. Agents Discuss
Each agent contributes from their expertise:
```
🏗️ Architect: "From a systems perspective..."
📋 PM: "But considering team scaling..."
💻 Developer: "In terms of development speed..."
🧪 TEA: "Testing complexity would be..."
```

### 4. Synthesis
BMAD Master summarizes key points and consensus (or disagreements).

### 5. Continue or Conclude
You can ask follow-up questions or move forward with a decision.

---

## Example Session

```
You: "Let's discuss the authentication approach for our app"

🧙 BMAD Master: "Assembling the relevant experts..."

🏗️ Architect (Winston): 
"For auth, I recommend JWT with refresh token rotation. 
It's stateless, scales well, and is battle-tested. 
The key decision is token storage - httpOnly cookies 
are more secure than localStorage."

📋 PM (John): 
"What about social login? Our users expect Google/GitHub 
sign-in. Does that complicate things?"

🏗️ Architect: 
"OAuth2 integration is straightforward. We'd use the 
social provider for initial auth, then issue our own 
JWT. Adds complexity but users expect it."

🧪 TEA (Murat): 
"Auth is high-risk. I'd want comprehensive tests:
- Token expiration handling
- Refresh token rotation
- Session invalidation
- Rate limiting on auth endpoints"

💻 Developer (Amelia): 
"I've implemented this pattern before. Using a library 
like next-auth or passport.js saves significant time 
and handles edge cases we'd miss."

🧙 BMAD Master: 
"Summary: Team recommends JWT with refresh tokens, 
stored in httpOnly cookies. Social login via OAuth2. 
Use established library rather than custom implementation. 
TEA will design comprehensive auth test suite.

Shall we proceed with this approach?"
```

---

## Agent Selection Guide

### Technical Discussions
- Architect (system design)
- Developer (implementation)
- TEA (quality/testing)

### Product Discussions
- PM (requirements)
- UX Designer (user experience)
- Analyst (research/data)

### Creative Discussions
- Brainstorm Coach (ideation)
- Problem Solver (solutions)
- Innovation Strategist (strategy)
- Storyteller (narrative)

### Full Team
- All relevant agents for retrospectives
- Cross-functional for major decisions

---

## Tips for Effective Party Mode

1. **Be specific** - Clear topics get better discussions
2. **Let agents debate** - Disagreement is valuable
3. **Ask follow-ups** - Dig deeper on interesting points
4. **Summarize decisions** - Capture what was decided
5. **Know when to exit** - Not everything needs a committee

---

## Exiting Party Mode

Say any of:
- "Thanks, let's move on"
- "Exit party mode"
- "Back to [specific agent]"
- "Let's implement this" (routes to Developer)

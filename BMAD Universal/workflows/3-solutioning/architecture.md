# Workflow: Create Architecture

## Purpose
Design system architecture based on PRD requirements.

## Agent
Architect (Winston)

## Prerequisites
- PRD document complete
- UX design (if UI-heavy project)

---

## Process

### Step 1: Review Requirements

**Actions:**
1. Read PRD functional requirements
2. Read PRD non-functional requirements
3. Understand user journeys
4. Note constraints and dependencies

**Key Questions:**
- What must the system DO?
- How must it PERFORM?
- What are the CONSTRAINTS?

---

### Step 2: Design System Components

**Actions:**
1. Identify major components
2. Define responsibilities
3. Map interactions
4. Create component diagram

**Component Categories:**
- Frontend (UI, state management)
- Backend (API, services, data)
- Infrastructure (database, cache, hosting)
- External (third-party services)

---

### Step 3: Design Data Architecture

**Actions:**
1. Identify entities
2. Define relationships
3. Design schemas
4. Create ER diagram

**Considerations:**
- Data normalization
- Query patterns
- Growth expectations

---

### Step 4: Design API

**Actions:**
1. Define API style (REST/GraphQL)
2. List endpoints
3. Define authentication
4. Document error handling

**For each endpoint:**
- Method and path
- Request format
- Response format
- Error cases

---

### Step 5: Select Technology Stack

**Decisions needed:**

| Layer | Options | Decision | Rationale |
|-------|---------|----------|-----------|
| Frontend | React, Vue, etc | [Choice] | [Why] |
| Backend | Node, Python, etc | [Choice] | [Why] |
| Database | Postgres, Mongo, etc | [Choice] | [Why] |
| Hosting | Vercel, AWS, etc | [Choice] | [Why] |

**Principles:**
- Boring technology is good
- Team familiarity matters
- Don't over-engineer

---

### Step 6: Address Quality Attributes

**Performance:**
- Response time targets
- Caching strategy
- Optimization approach

**Security:**
- Authentication method
- Authorization model
- Data protection

**Scalability:**
- Scaling approach
- Bottleneck mitigation

**Reliability:**
- Error handling
- Recovery strategy
- Monitoring approach

---

### Step 7: Plan Deployment

**Actions:**
1. Define environments
2. Design CI/CD pipeline
3. Plan monitoring
4. Document deployment process

---

### Step 8: Document Decisions (ADRs)

For each significant decision:

```markdown
### ADR-[N]: [Decision Title]

**Status:** Accepted

**Context:** 
[Why this decision was needed]

**Decision:** 
[What was decided]

**Consequences:** 
[Impact of the decision]
```

---

### Step 9: Validate Architecture

Run through architecture checklist:
- [ ] All PRD requirements addressable
- [ ] NFRs have solutions
- [ ] Technology choices justified
- [ ] Security addressed
- [ ] Scalability considered
- [ ] Deployment planned

---

## Output

- Architecture document: `docs/architecture.md`
- Use template: `templates/architecture.md`

---

## Next Steps

After architecture complete:
1. Create epics and stories (PM)
2. Implementation readiness check
3. Begin sprint planning

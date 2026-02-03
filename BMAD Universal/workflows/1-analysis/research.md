# Workflow: Research

## Purpose
Conduct comprehensive research to inform product decisions with verified, factual information.

## Agent
Analyst (Mary)

## Command
`*research` or `*research [type]`

## Research Types
- `*research domain` - Domain/Industry research
- `*research market` - Market & competitive analysis
- `*research technical` - Technical feasibility research

---

## Anti-Hallucination Protocol

**CRITICAL:** Research must be grounded in verifiable facts.

1. **State knowledge boundaries** - Clearly indicate when information is uncertain
2. **Cite sources** - Reference specific sources when making claims
3. **Distinguish facts from assumptions** - Label clearly what is known vs. hypothesized
4. **Acknowledge gaps** - Be explicit about what couldn't be verified
5. **Request validation** - Ask user to verify critical findings

---

## Process

### Domain Research

**Purpose:** Understand the industry/domain context

**Steps:**
1. **Define Domain Scope**
   - What industry/sector?
   - What specific subdomain?
   - Geographic scope?

2. **Gather Domain Knowledge**
   - Industry terminology and concepts
   - Key players and stakeholders
   - Regulatory environment
   - Industry trends and direction

3. **Identify Domain Patterns**
   - Common workflows
   - Standard practices
   - Pain points
   - Success factors

4. **Document Findings**
   ```markdown
   # Domain Research: [Domain]

   ## Industry Overview
   [Description of the industry/domain]

   ## Key Terminology
   | Term | Definition |
   |------|------------|
   | [Term] | [Definition] |

   ## Stakeholders
   - [Stakeholder type]: [Role and interests]

   ## Regulatory Considerations
   - [Regulation]: [Impact]

   ## Industry Trends
   - [Trend]: [Description and implications]

   ## Knowledge Gaps
   - [Areas requiring further research]
   ```

---

### Market Research

**Purpose:** Analyze market opportunity and competitive landscape

**Steps:**
1. **Define Market Scope**
   - Target market segment
   - Geographic boundaries
   - Customer segments

2. **Competitive Analysis**
   - Direct competitors
   - Indirect competitors
   - Substitute solutions
   - Market positioning

3. **Market Dynamics**
   - Market size and growth
   - Key trends
   - Entry barriers
   - Success factors

4. **Document Findings**
   ```markdown
   # Market Research: [Market]

   ## Market Overview
   - Size: [estimate with source]
   - Growth: [trend]
   - Segments: [breakdown]

   ## Competitive Landscape
   ### Direct Competitors
   | Competitor | Strengths | Weaknesses | Positioning |
   |------------|-----------|------------|-------------|
   | [Name] | [Strengths] | [Weaknesses] | [Position] |

   ### Competitive Gaps
   - [Opportunity not addressed by competitors]

   ## Target Customer
   - Segment: [description]
   - Needs: [key needs]
   - Behaviors: [relevant behaviors]

   ## Market Trends
   - [Trend]: [Impact on opportunity]

   ## Opportunity Assessment
   [Analysis of market opportunity]

   ## Sources & Confidence
   - [Source]: [What it informed]
   - Confidence level: High/Medium/Low
   ```

---

### Technical Research

**Purpose:** Assess technical feasibility and approach options

**Steps:**
1. **Define Technical Scope**
   - Problem to solve technically
   - Constraints (performance, scale, cost)
   - Existing technical context

2. **Research Options**
   - Available technologies
   - Frameworks and libraries
   - Architectural patterns
   - Integration approaches

3. **Evaluate Feasibility**
   - Technical complexity
   - Resource requirements
   - Risk factors
   - Proof of concept needs

4. **Document Findings**
   ```markdown
   # Technical Research: [Topic]

   ## Problem Statement
   [Technical problem to solve]

   ## Constraints
   - [Constraint]: [Impact]

   ## Technology Options
   ### Option 1: [Technology/Approach]
   - **Description:** [What it is]
   - **Pros:** [Advantages]
   - **Cons:** [Disadvantages]
   - **Fit:** [How well it fits needs]

   ### Option 2: [Technology/Approach]
   [Same structure]

   ## Recommendation
   [Recommended approach with rationale]

   ## Risks & Unknowns
   - [Risk]: [Mitigation]
   - [Unknown]: [How to resolve]

   ## POC Needs
   - [What needs to be proven]

   ## Sources
   - [Documentation/article referenced]
   ```

---

## Output

- Research document (domain, market, or technical)
- Key findings summary
- Recommendations
- Knowledge gaps and next steps

---

## Research Quality Checklist

- [ ] Scope clearly defined
- [ ] Multiple perspectives considered
- [ ] Sources cited where possible
- [ ] Facts distinguished from assumptions
- [ ] Knowledge gaps acknowledged
- [ ] Actionable recommendations provided
- [ ] Confidence levels indicated

---

## Next Steps

After research:
- Present findings to stakeholders
- Inform product brief creation
- Guide PRD development
- Support architecture decisions

# Workflow: Test Framework Design (TF)

## Purpose
Design comprehensive test framework architecture aligned with system architecture and quality requirements.

## Agent
Test Architect (TEA) - Tessa

## Command
`*framework`

---

## Prerequisites

- Architecture document available
- NFRs/Quality requirements defined
- Technology stack known

---

## Process

### Step 1: Analyze Architecture

Load and review:
- `docs/architecture.md` - System components
- `docs/prd.md` - Quality requirements
- Tech stack and constraints

**Identify:**
- Testable boundaries
- Integration points
- External dependencies
- Data flows

### Step 2: Define Test Layers

Map test types to architecture:

```
┌─────────────────────────────────────────────┐
│              E2E Tests                       │
│         (Critical User Journeys)            │
├─────────────────────────────────────────────┤
│           Integration Tests                  │
│    (Service Boundaries, API Contracts)      │
├─────────────────────────────────────────────┤
│             Unit Tests                       │
│     (Business Logic, Utilities)             │
└─────────────────────────────────────────────┘
```

**Layer Guidelines:**
- **Unit (70%)**: Fast, isolated, business logic
- **Integration (20%)**: Service interactions, data layer
- **E2E (10%)**: Critical paths, user journeys

### Step 3: Select Tools

**Based on stack, recommend:**

| Layer | Common Tools |
|-------|--------------|
| Unit | Jest, Vitest, pytest, JUnit |
| Integration | Supertest, TestContainers |
| E2E | Playwright, Cypress, Selenium |
| API | Postman, REST Assured |
| Performance | k6, Artillery, JMeter |

**Selection Criteria:**
- Team familiarity
- CI/CD integration
- Maintenance burden
- Community support

### Step 4: Design Test Infrastructure

**Components to define:**

1. **Test Data Management**
   - Fixtures strategy
   - Factory patterns
   - Database seeding

2. **Environment Configuration**
   - Test environment isolation
   - Configuration management
   - Secrets handling

3. **Mocking Strategy**
   - External service mocks
   - Mock server setup
   - Contract testing approach

4. **Reporting**
   - Test result format
   - Coverage reporting
   - Trend tracking

### Step 5: Document Framework

Create `docs/test-framework.md`:

```markdown
# Test Framework

## Overview
[Framework purpose and scope]

## Test Layers
- Unit: [tools, location, patterns]
- Integration: [tools, location, patterns]
- E2E: [tools, location, patterns]

## Infrastructure
- Test data: [approach]
- Mocking: [strategy]
- CI integration: [pipeline details]

## Conventions
- Naming: [pattern]
- Structure: [organization]
- Coverage: [targets]

## Running Tests
[Commands and configuration]
```

---

## Output

- `docs/test-framework.md` - Complete framework documentation
- Recommended tool configuration
- Test directory structure proposal

---

## Anti-Patterns to Avoid

1. ❌ Testing implementation details
2. ❌ Flaky tests (non-deterministic)
3. ❌ Slow test suites blocking CI
4. ❌ Excessive mocking hiding bugs
5. ❌ No test isolation (shared state)

---

## Next Steps

After framework design:
- `*test-design` - Create test specifications
- `*automate` - Implement test automation
- `*ci` - Configure CI pipeline

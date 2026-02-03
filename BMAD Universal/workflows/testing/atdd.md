# Workflow: Acceptance Test-Driven Development (AT)

## Purpose
Define acceptance tests before implementation to ensure features meet requirements.

## Agent
Test Architect (TEA) - Tessa

## Command
`*atdd` or `*atdd [story]`

---

## Prerequisites

- User story defined
- Acceptance criteria clear
- Stakeholder input available

---

## ATDD Cycle

```
     ┌─────────────────────────────────────────┐
     │                                         │
     ▼                                         │
┌─────────┐    ┌─────────┐    ┌─────────┐    │
│ Discuss │ →  │ Distill │ →  │ Develop │ ────┘
└─────────┘    └─────────┘    └─────────┘
```

1. **Discuss** - Collaborate on requirements
2. **Distill** - Write executable specifications
3. **Develop** - Implement to pass specs

---

## Process

### Step 1: Discuss (Three Amigos)

**Participants:**
- Product (what)
- Development (how)  
- Testing (what if)

**For each story, clarify:**
- Business value
- Happy path scenarios
- Edge cases and exceptions
- Out of scope items

### Step 2: Distill into Specs

**Convert acceptance criteria to Gherkin:**

```gherkin
Feature: [Feature Name]
  As a [role]
  I want [capability]
  So that [benefit]

  Background:
    Given [common preconditions]

  Scenario: Happy path
    Given [initial context]
    And [more context]
    When [action]
    Then [expected outcome]
    And [additional verification]

  Scenario: Edge case
    Given [context]
    When [action with edge input]
    Then [expected handling]

  Scenario Outline: Multiple inputs
    Given [context]
    When I input <value>
    Then I should see <result>

    Examples:
      | value | result |
      | A     | X      |
      | B     | Y      |
```

### Step 3: Automate Specifications

**Create step definitions:**

```typescript
// steps/feature.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';

Given('a user is logged in', async function () {
  await this.login(testUser);
});

When('they submit the form', async function () {
  await this.page.click('button[type="submit"]');
});

Then('they should see a success message', async function () {
  await expect(this.page.locator('.success')).toBeVisible();
});
```

### Step 4: Red-Green Cycle

1. **Red** - Run specs, verify they fail
2. **Implement** - Write minimal code to pass
3. **Green** - Verify specs pass
4. **Refactor** - Clean up implementation

### Step 5: Living Documentation

Specs become documentation:
- Always current (must pass CI)
- Business-readable
- Examples as specifications

---

## Output

- Feature files (`.feature`)
- Step definitions
- Living documentation
- Requirement traceability

---

## Gherkin Best Practices

### Do
- Use business language
- Keep scenarios independent
- One behavior per scenario
- Meaningful scenario names
- Background for common setup

### Don't
- Include implementation details
- Use technical jargon
- Create scenario dependencies
- Write procedural steps
- Over-specify UI elements

---

## Example: Login Feature

```gherkin
Feature: User Authentication
  As a registered user
  I want to log into my account
  So that I can access my personalized content

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    And I submit the login form
    Then I should be redirected to the dashboard
    And I should see my username displayed

  Scenario: Failed login with invalid password
    Given I am on the login page
    When I enter an invalid password
    And I submit the login form
    Then I should see an error message
    And I should remain on the login page

  Scenario: Account lockout after failed attempts
    Given I am on the login page
    And I have failed login 4 times
    When I enter an invalid password again
    Then my account should be locked
    And I should see a lockout message
```

---

## Tools

- **Cucumber** - BDD framework (JS, Java, Ruby)
- **SpecFlow** - .NET BDD
- **Behave** - Python BDD
- **Playwright + Cucumber** - E2E BDD

---

## Next Steps

After ATDD setup:
- `*trace` - Link specs to requirements
- `*automate` - Complete automation
- Development proceeds against specs

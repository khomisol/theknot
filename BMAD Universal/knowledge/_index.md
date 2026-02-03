# TEA Knowledge Base Index

Quick reference for all testing knowledge fragments. Load relevant files based on your current task.

---

## How to Use

When working with TEA (Test Architect), reference these knowledge files for detailed patterns and examples. Load only what you need for the current task.

**Usage:** `Load knowledge/[filename].md for [topic] guidance`

---

## Architecture & Patterns

| File | Description | Use When |
|------|-------------|----------|
| [fixture-architecture.md](fixture-architecture.md) | Composable fixture patterns, pure functions, mergeTests | Setting up test infrastructure |
| [data-factories.md](data-factories.md) | Factory functions with overrides, API seeding | Creating test data |
| [network-first.md](network-first.md) | Intercept-before-navigate, HAR capture, deterministic waits | Testing network-dependent features |
| [api-testing-patterns.md](api-testing-patterns.md) | Pure API tests without browser, service testing | Backend/API testing |
| [api-request.md](api-request.md) | API request utility with retry, schema validation | API testing with enhanced features |
| [adr-quality-readiness-checklist.md](adr-quality-readiness-checklist.md) | 29-criteria framework for system testability and NFR | Architecture review, NFR assessment |

---

## Quality & Standards

| File | Description | Use When |
|------|-------------|----------|
| [test-quality.md](test-quality.md) | Deterministic tests, isolation, explicit assertions | Writing any test |
| [test-levels.md](test-levels.md) | Unit vs integration vs E2E guidelines | Choosing test level |
| [test-priorities.md](test-priorities.md) | P0-P3 criteria, coverage targets | Prioritizing tests |
| [nfr-criteria.md](nfr-criteria.md) | Security, performance, reliability criteria | NFR assessment |

---

## CI/CD & Automation

| File | Description | Use When |
|------|-------------|----------|
| [ci-burn-in.md](ci-burn-in.md) | Staged jobs, shard orchestration, burn-in loops | CI pipeline setup |
| [selective-testing.md](selective-testing.md) | Tag/grep usage, diff-based runs | Optimizing test runs |
| [playwright-config.md](playwright-config.md) | Environment switching, timeout standards | Playwright configuration |

---

## Risk & Governance

| File | Description | Use When |
|------|-------------|----------|
| [risk-governance.md](risk-governance.md) | Scoring matrix, category ownership, gate decisions | Risk assessment |
| [probability-impact.md](probability-impact.md) | Shared definitions for scoring and thresholds | Risk scoring |

---

## Authentication & Security

| File | Description | Use When |
|------|-------------|----------|
| [auth-session.md](auth-session.md) | Token persistence, multi-user, API/browser auth | Testing authenticated flows |
| [email-auth.md](email-auth.md) | Magic link extraction, state preservation | Testing email-based auth |
| [feature-flags.md](feature-flags.md) | Enum management, targeting helpers, cleanup | Testing with feature flags |

---

## Debugging & Maintenance

| File | Description | Use When |
|------|-------------|----------|
| [visual-debugging.md](visual-debugging.md) | Trace viewer, artifact expectations | Debugging test failures |
| [timing-debugging.md](timing-debugging.md) | Race condition identification, deterministic waits | Fixing flaky tests |
| [test-healing.md](test-healing.md) | Common failure patterns and fixes | Maintaining tests |
| [selector-resilience.md](selector-resilience.md) | Robust selector strategies | Fixing brittle locators |

---

## Specialized Patterns

| File | Description | Use When |
|------|-------------|----------|
| [contract-testing.md](contract-testing.md) | Pact publishing, provider verification | Microservices testing |
| [component-tdd.md](component-tdd.md) | Red-green-refactor, provider isolation | Component testing |
| [error-handling.md](error-handling.md) | Exception handling, retry validation | Testing error scenarios |

---

## Utilities

| File | Description | Use When |
|------|-------------|----------|
| [intercept-network.md](intercept-network.md) | Network spy/stub, JSON parsing | Mocking network calls |
| [network-recorder.md](network-recorder.md) | HAR record/playback | Offline testing |
| [network-monitor.md](network-monitor.md) | HTTP 4xx/5xx detection | Error detection |
| [file-utils.md](file-utils.md) | CSV/XLSX/PDF/ZIP validation | File testing |
| [log-utils.md](log-utils.md) | Report logging, structured output | Test logging |
| [recurse-polling.md](recurse-polling.md) | Async polling for eventual consistency | Testing async operations |

---

## Quick Reference by Workflow

### *framework (Test Framework Setup)
- `fixture-architecture.md` - Core patterns
- `data-factories.md` - Factory setup
- `playwright-config.md` - Configuration

### *test-design (Test Design)
- `test-quality.md` - Quality standards
- `test-levels.md` - Level selection
- `test-priorities.md` - Prioritization

### *automate (Test Automation)
- `network-first.md` - Network patterns
- `api-testing-patterns.md` - API tests
- `data-factories.md` - Test data

### *ci (CI Configuration)
- `ci-burn-in.md` - Pipeline design
- `selective-testing.md` - Test selection

### *nfr-assess (NFR Assessment)
- `nfr-criteria.md` - Assessment criteria
- `risk-governance.md` - Risk evaluation

### *test-review (Test Review)
- `test-quality.md` - Quality checklist
- `test-healing.md` - Fix patterns

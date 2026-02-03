# Workflow: CI Configuration (CI)

## Purpose
Configure continuous integration pipeline for automated test execution.

## Agent
Test Architect (TEA) - Tessa

## Command
`*ci`

---

## Prerequisites

- Test framework established
- Tests implemented
- CI platform selected (GitHub Actions, GitLab CI, etc.)

---

## Process

### Step 1: Assess CI Requirements

**Determine:**
- CI platform in use
- Test execution stages needed
- Environment requirements
- Notification needs

**Typical stages:**
1. Lint/Format check
2. Unit tests
3. Integration tests
4. E2E tests (optional per PR)
5. Coverage reporting

### Step 2: Design Pipeline Structure

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│    Lint     │ → │    Unit     │ → │ Integration │
└─────────────┘   └─────────────┘   └─────────────┘
                                           │
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                   ┌──────────┐     ┌──────────┐     ┌──────────┐
                   │ Coverage │     │   E2E    │     │  Deploy  │
                   └──────────┘     └──────────┘     └──────────┘
```

### Step 3: Configure CI Platform

**GitHub Actions Example:**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test-unit:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  test-integration:
    runs-on: ubuntu-latest
    needs: test-unit
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost/test

  test-e2e:
    runs-on: ubuntu-latest
    needs: test-integration
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### Step 4: Configure Test Reporting

**Coverage gates:**
```yaml
# In test config (jest.config.js, vitest.config.ts)
coverageThreshold:
  global:
    branches: 80
    functions: 80
    lines: 80
    statements: 80
```

**PR comments (GitHub):**
```yaml
- uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '✅ All tests passed!'
      })
```

### Step 5: Optimize Pipeline

**Speed improvements:**
- Parallel job execution
- Caching dependencies
- Selective test running (changed files only)
- Matrix builds for multiple environments

**Example matrix:**
```yaml
strategy:
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, windows-latest]
```

---

## Output

- CI configuration file (`.github/workflows/ci.yml` etc.)
- Coverage threshold configuration
- Test scripts in package.json
- Documentation in test-framework.md

---

## Platform Quick Reference

### GitHub Actions
- Config: `.github/workflows/*.yml`
- Services: Built-in container support
- Artifacts: `actions/upload-artifact`

### GitLab CI
- Config: `.gitlab-ci.yml`
- Services: In job definition
- Artifacts: `artifacts:` keyword

### CircleCI
- Config: `.circleci/config.yml`
- Services: Docker executor
- Artifacts: `store_artifacts`

---

## Best Practices

1. **Fail fast** - Run quick checks first
2. **Cache aggressively** - Dependencies, build outputs
3. **Parallelize** - Independent jobs run together
4. **Meaningful names** - Clear job/step names
5. **Artifacts** - Save logs, screenshots on failure
6. **Notifications** - Alert on failure, not success

---

## Next Steps

After CI configuration:
- `*test-review` - Monitor test health
- `*nfr-assess` - Assess non-functional requirements

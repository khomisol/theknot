# TEA Framework Setup Checklist

> **Purpose**: Validate test framework setup is complete and follows best practices.

---

## Project Structure

- [ ] Test directory structure follows conventions
  - `tests/` or `e2e/` as root
  - Organized by feature/domain
  - Page objects/components separated
- [ ] Configuration files in place
  - `playwright.config.ts` exists
  - Environment configs defined
  - Reporter configurations set
- [ ] Fixtures directory organized
  - Auth fixtures defined
  - Data factories created
  - Utility helpers extracted
- [ ] `.gitignore` includes test artifacts
  - `test-results/`
  - `playwright-report/`
  - `auth/*.json`

---

## Configuration Validation

### Playwright Config
- [ ] Base URL configured for environments
- [ ] Timeouts appropriate for application
  - Test timeout: 30-60s
  - Assertion timeout: 5-10s
  - Navigation timeout: 30s
- [ ] Projects defined for browser matrix
- [ ] Retries configured (CI vs local)
- [ ] Artifacts configured
  - Screenshots on failure
  - Video retention policy
  - Trace on first retry
- [ ] Reporter configuration complete

### Environment Setup
- [ ] Environment variables documented
- [ ] `.env.example` file exists
- [ ] Secrets management defined
- [ ] Test data sources configured

---

## Dependencies

- [ ] Playwright version current
- [ ] TypeScript configured (if using)
- [ ] Required packages installed
  - `@playwright/test`
  - Assertion libraries (if needed)
  - Utility packages
- [ ] `package.json` scripts defined
  - `test` - Run all tests
  - `test:smoke` - Smoke tests
  - `test:headed` - Debug mode
  - `test:ui` - UI mode

---

## Authentication Setup

- [ ] Auth strategy defined
  - Storage state files
  - Global setup/teardown
  - Per-worker isolation
- [ ] Test accounts provisioned
  - Admin account
  - Regular user account(s)
  - Role-specific accounts
- [ ] Credentials securely stored
- [ ] Session refresh handled

---

## CI/CD Integration

- [ ] Pipeline configuration exists
- [ ] Browser installation included
- [ ] Artifact upload configured
- [ ] Parallelization/sharding set up
- [ ] Failure notifications configured
- [ ] Report publication automated

---

## Code Quality

- [ ] ESLint/Prettier configured for tests
- [ ] Test naming conventions documented
- [ ] Selector strategy defined
  - Prefer `data-testid`
  - ARIA roles as fallback
- [ ] Page Object pattern established
- [ ] Shared utilities extracted

---

## Documentation

- [ ] README includes test instructions
- [ ] Architecture decisions documented
- [ ] Onboarding guide created
- [ ] Common patterns documented

---

## Validation Tests

- [ ] Sample smoke test passes
- [ ] Auth flow test passes
- [ ] CI pipeline green
- [ ] Reports generate correctly

---

## Sign-off

| Item | Reviewer | Date |
|------|----------|------|
| Structure review | | |
| Config review | | |
| CI integration | | |
| Documentation | | |

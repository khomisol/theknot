# Code Review Checklist

## Before Review
- [ ] PR has clear description of changes
- [ ] PR is linked to story/issue
- [ ] PR is appropriately sized (< 400 lines ideal)
- [ ] CI passes (tests, lint, build)

---

## Functionality
- [ ] Code accomplishes stated purpose
- [ ] Edge cases handled appropriately
- [ ] Error handling is robust
- [ ] No obvious bugs or logic errors
- [ ] Acceptance criteria met

---

## Code Quality
- [ ] Code is readable and self-documenting
- [ ] Functions/methods have single responsibility
- [ ] No unnecessary complexity
- [ ] No code duplication (DRY)
- [ ] Naming is clear and consistent
- [ ] Comments explain "why" not "what"

---

## Architecture
- [ ] Follows established patterns
- [ ] Appropriate separation of concerns
- [ ] No inappropriate coupling
- [ ] Changes don't break existing contracts
- [ ] Backward compatibility maintained (if needed)

---

## Testing
- [ ] Unit tests cover new logic
- [ ] Integration tests cover new boundaries
- [ ] Tests are deterministic (no flakiness)
- [ ] Test names describe behavior
- [ ] Edge cases tested
- [ ] Error paths tested

---

## Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output encoding where needed
- [ ] Authentication/authorization correct
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

---

## Performance
- [ ] No obvious performance issues
- [ ] Database queries optimized (no N+1)
- [ ] Appropriate caching considered
- [ ] No memory leaks
- [ ] Async operations used appropriately

---

## Documentation
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Inline comments for complex logic
- [ ] Migration instructions if needed

---

## Final Checks
- [ ] No console.log/debug statements
- [ ] No TODO comments for this PR
- [ ] No commented-out code
- [ ] File organization makes sense
- [ ] Imports cleaned up

---

## Reviewer Notes
[Space for reviewer comments and suggestions]

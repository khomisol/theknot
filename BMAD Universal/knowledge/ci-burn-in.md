# CI Pipeline and Burn-In Strategy

## Principle

CI pipelines must execute tests reliably, quickly, and provide clear feedback. Burn-in testing (running changed tests multiple times) flushes out flakiness before merge. Stage jobs strategically: install/cache once, run changed specs first for fast feedback, then shard full suites.

---

## Why This Matters

CI is the quality gate for production. A poorly configured pipeline either:
- Wastes developer time (slow feedback, false positives)
- Ships broken code (false negatives, insufficient coverage)

Burn-in testing ensures reliability by stress-testing changed code, while parallel execution optimizes speed.

---

## Pattern 1: GitHub Actions with Sharding

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on:
  pull_request:
  push:
    branches: [main]

env:
  CACHE_KEY: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

jobs:
  install:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            node_modules
            ~/.cache/ms-playwright
          key: ${{ env.CACHE_KEY }}
      - run: npm ci
      - run: npx playwright install --with-deps chromium

  burn-in:
    needs: install
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
      - uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ env.CACHE_KEY }}
      - name: Detect changed tests
        id: changed
        run: |
          SPECS=$(git diff --name-only origin/main...HEAD | grep -E '\.(spec|test)\.(ts|js)$' || echo "")
          echo "specs=${SPECS}" >> $GITHUB_OUTPUT
      - name: Burn-in (10 iterations)
        if: steps.changed.outputs.specs != ''
        run: |
          for i in {1..10}; do
            echo "Iteration $i/10"
            npm run test -- ${{ steps.changed.outputs.specs }} || exit 1
          done

  test-sharded:
    needs: [install, burn-in]
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ env.CACHE_KEY }}
      - run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-${{ matrix.shard }}
          path: test-results/
```

---

## Pattern 2: Burn-In Script

```bash
#!/bin/bash
# scripts/burn-in.sh

ITERATIONS=${1:-10}
BASE_BRANCH=${2:-main}

echo "🔥 Burn-In Test Runner"
echo "Iterations: $ITERATIONS"

# Detect changed test files
SPECS=$(git diff --name-only $BASE_BRANCH...HEAD | grep -E '\.(spec|test)\.(ts|js)$' || echo "")

if [ -z "$SPECS" ]; then
  echo "✅ No test files changed. Skipping."
  exit 0
fi

echo "Changed specs:"
echo "$SPECS" | sed 's/^/  - /'

# Run burn-in loop
for i in $(seq 1 $ITERATIONS); do
  echo "━━━ Iteration $i/$ITERATIONS ━━━"
  if npm run test -- $SPECS; then
    echo "✅ Passed"
  else
    echo "❌ Failed on iteration $i"
    exit 1
  fi
done

echo "🎉 Burn-in passed: $ITERATIONS iterations"
```

**Usage:**
```bash
./scripts/burn-in.sh 10 main     # 10 iterations, compare to main
./scripts/burn-in.sh 20 develop  # 20 iterations, compare to develop
```

---

## Pattern 3: Selective Test Execution

Run only relevant tests based on file changes:

```bash
#!/bin/bash
# scripts/selective-tests.sh

CHANGED=$(git diff --name-only origin/main...HEAD)

# Critical files = run all
if echo "$CHANGED" | grep -qE '(package\.json|playwright\.config)'; then
  echo "Critical files changed. Running ALL tests."
  npm run test
  exit $?
fi

# Auth changes = auth + smoke tests
if echo "$CHANGED" | grep -qE '(auth|login|security)'; then
  echo "Auth files changed. Running auth + smoke."
  npm run test -- --grep "@auth|@smoke"
  exit $?
fi

# API changes = integration + smoke
if echo "$CHANGED" | grep -qE '(api|service)'; then
  echo "API files changed. Running integration."
  npm run test -- --grep "@integration|@smoke"
  exit $?
fi

# Default = smoke only
echo "Running smoke tests."
npm run test -- --grep "@smoke"
```

---

## CI Configuration Checklist

- [ ] **Caching**: node_modules, npm cache, browser binaries cached
- [ ] **Timeout budgets**: Each job has reasonable timeout (10-30 min)
- [ ] **Artifact retention**: 30 days reports, 7 days failure artifacts
- [ ] **Parallelization**: Matrix with `fail-fast: false`
- [ ] **Burn-in enabled**: Changed specs run 5-10x before merge
- [ ] **App startup wait**: CI waits for app to start
- [ ] **Local parity**: CI scripts runnable locally

---

## Shard Distribution

| Test Count | Recommended Shards |
|------------|-------------------|
| < 50 | 1-2 |
| 50-200 | 4 |
| 200-500 | 8 |
| > 500 | 16+ |

**Rule of thumb:** Each shard should complete in 5-10 minutes.

---

## Related Knowledge

- `selective-testing.md` - Tag-based test filtering
- `playwright-config.md` - Configuration for CI
- `test-quality.md` - Quality standards

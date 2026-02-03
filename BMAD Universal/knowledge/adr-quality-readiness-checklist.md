# ADR Quality Readiness Checklist

**Purpose:** Standardized 8-category, 29-criteria framework for evaluating system testability and NFR compliance during architecture review (Phase 3) and NFR assessment.

**When to Use:**
- System-level test design (Phase 3): Identify testability gaps in architecture
- NFR assessment workflow: Structured evaluation with evidence
- Gate decisions: Quantifiable criteria (X/29 met = PASS/CONCERNS/FAIL)

**How to Use:**
1. For each criterion, assess status: ✅ Covered / ⚠️ Gap / ⬜ Not Assessed
2. Document gap description if ⚠️
3. Describe risk if criterion unmet
4. Map to test scenarios (what tests validate this criterion)

---

## 1. Testability & Automation

**Question:** Can we verify this effectively without manual toil?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 1.1 | **Isolation:** Can the service be tested with all downstream dependencies (DBs, APIs, Queues) mocked or stubbed? | Flaky tests; inability to test in isolation | P1: Service runs with mocked DB, P1: Service runs with mocked API, P2: Integration tests with real deps |
| 1.2 | **Headless Interaction:** Is 100% of the business logic accessible via API (REST/gRPC) to bypass the UI for testing? | Slow, brittle UI-based automation | P0: All core logic callable via API, P1: No UI dependency for critical paths |
| 1.3 | **State Control:** Do we have "Seeding APIs" or scripts to inject specific data states (e.g., "User with expired subscription") instantly? | Long setup times; inability to test edge cases | P0: Seed baseline data, P0: Inject edge case data states, P1: Cleanup after tests |
| 1.4 | **Sample Requests:** Are there valid and invalid cURL/JSON sample requests provided in the design doc for QA to build upon? | Ambiguity on how to consume the service | P1: Valid request succeeds, P1: Invalid request fails with clear error |

**Common Gaps:**
- No mock endpoints for external services
- Business logic tightly coupled to UI
- No seeding APIs (manual database setup required)
- ADR has architecture diagrams but no sample API requests

**Mitigation Examples:**
- 1.1 (Isolation): Provide mock endpoints, dependency injection, interface abstractions
- 1.2 (Headless): Expose all business logic via REST/GraphQL APIs
- 1.3 (State Control): Implement `/api/test-data` seeding endpoints (dev/staging only)
- 1.4 (Sample Requests): Add "Example API Calls" section to ADR with cURL commands

---

## 2. Test Data Strategy

**Question:** How do we fuel our tests safely?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 2.1 | **Segregation:** Does the design support multi-tenancy or specific headers (e.g., x-test-user) to keep test data out of prod metrics? | Skewed business analytics; data pollution | P0: Multi-tenant isolation, P1: Test data excluded from prod metrics |
| 2.2 | **Generation:** Can we use synthetic data, or do we rely on scrubbing production data (GDPR/PII risk)? | Privacy violations; dependency on stale data | P0: Faker-based synthetic data, P1: No production data in tests |
| 2.3 | **Teardown:** Is there a mechanism to "reset" the environment or clean up data after destructive tests? | Environment rot; subsequent test failures | P0: Automated cleanup after tests, P2: Environment reset script |

**Common Gaps:**
- No customer_id scoping in queries (cross-tenant data leakage risk)
- Reliance on production data dumps (GDPR/PII violations)
- No cleanup mechanism (tests leave data behind)

**Mitigation Examples:**
- 2.1 (Segregation): Enforce customer_id in all queries, add test-specific headers
- 2.2 (Generation): Use Faker library, create synthetic data generators
- 2.3 (Teardown): Auto-cleanup hooks in test framework, isolated test customer IDs

---

## 3. Scalability & Availability

**Question:** Can it grow, and will it stay up?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 3.1 | **Statelessness:** Is the service stateless? If not, how is session state replicated across instances? | Inability to auto-scale horizontally | P1: Service restart mid-request → no data loss, P2: Horizontal scaling under load |
| 3.2 | **Bottlenecks:** Have we identified the weakest link (e.g., database connections, API rate limits) under load? | System crash during peak traffic | P2: Load test identifies bottleneck, P2: Connection pool exhaustion handled |
| 3.3 | **SLA Definitions:** What is the target Availability (e.g., 99.9%) and does the architecture support redundancy to meet it? | Breach of contract; customer churn | P1: Availability target defined, P2: Redundancy validated |
| 3.4 | **Circuit Breakers:** If a dependency fails, does this service fail fast or hang? | Cascading failures taking down the whole platform | P1: Circuit breaker opens on 5 failures, P1: Auto-reset after recovery |

**Common Gaps:**
- Stateful session management (can't scale horizontally)
- No load testing, bottlenecks unknown
- SLA undefined or unrealistic
- No circuit breakers (cascading failures)

**Mitigation Examples:**
- 3.1 (Statelessness): Externalize session to Redis/JWT
- 3.2 (Bottlenecks): Load test with k6, monitor connection pools
- 3.3 (SLA): Define realistic SLA (99.9% = 43 min/month downtime)
- 3.4 (Circuit Breakers): Implement circuit breakers, fail fast on errors

---

## 4. Disaster Recovery (DR)

**Question:** What happens when the worst-case scenario occurs?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 4.1 | **RTO/RPO:** What is the Recovery Time Objective (how long to restore) and Recovery Point Objective (max data loss)? | Extended outages; data loss liability | P2: RTO defined and tested, P2: RPO validated |
| 4.2 | **Failover:** Is region/zone failover automated or manual? Has it been practiced? | "Heroics" required during outages | P2: Automated failover works, P2: Manual failover documented |
| 4.3 | **Backups:** Are backups immutable and tested for restoration integrity? | Ransomware vulnerability; corrupted backups | P2: Backup restore succeeds, P2: Backup immutability validated |

**Common Gaps:**
- RTO/RPO undefined (no recovery plan)
- Failover never tested
- Backups exist but restoration never validated

**Mitigation Examples:**
- 4.1 (RTO/RPO): Define RTO (e.g., 4 hours) and RPO (e.g., 1 hour)
- 4.2 (Failover): Automate multi-region failover, practice drills quarterly
- 4.3 (Backups): Implement immutable backups, test restore monthly

---

## 5. Security

**Question:** Is the design safe by default?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 5.1 | **AuthN/AuthZ:** Does it implement standard protocols (OAuth2/OIDC)? Are permissions granular (Least Privilege)? | Unauthorized access; data leaks | P0: OAuth flow works, P0: Expired token rejected, P0: Insufficient permissions return 403 |
| 5.2 | **Encryption:** Is data encrypted at rest (DB) and in transit (TLS)? | Compliance violations; data theft | P1: Data-at-rest encrypted, P1: TLS 1.2+ enforced |
| 5.3 | **Secrets:** Are API keys/passwords stored in a Vault (not in code or config files)? | Credentials leaked in git history | P1: No hardcoded secrets, P1: Secrets loaded from vault |
| 5.4 | **Input Validation:** Are inputs sanitized against Injection attacks (SQLi, XSS)? | System compromise via malicious payloads | P1: SQL injection sanitized, P1: XSS escaped |

**Common Gaps:**
- Weak authentication (no OAuth, hardcoded API keys)
- No encryption at rest
- Secrets in git
- No input validation

**Mitigation Examples:**
- 5.1 (AuthN/AuthZ): Implement OAuth 2.1/OIDC, enforce least privilege
- 5.2 (Encryption): Enable TDE, enforce TLS 1.2+
- 5.3 (Secrets): Migrate to AWS Secrets Manager/Vault
- 5.4 (Input Validation): Sanitize all inputs, use parameterized queries

---

## 6. Monitorability, Debuggability & Manageability

**Question:** Can we operate and fix this in production?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 6.1 | **Tracing:** Does the service propagate W3C Trace Context / Correlation IDs for distributed tracing? | Impossible to debug errors across microservices | P2: W3C Trace Context propagated, P2: Correlation ID in all logs |
| 6.2 | **Logs:** Can log levels (INFO vs DEBUG) be toggled dynamically without a redeploy? | Inability to diagnose issues in real-time | P2: Log level toggle works without redeploy |
| 6.3 | **Metrics:** Does it expose RED metrics (Rate, Errors, Duration) for Prometheus/Datadog? | Flying blind regarding system health | P2: /metrics endpoint exposes RED metrics |
| 6.4 | **Config:** Is configuration externalized? Can we change behavior without a code build? | Rigid system; full deploys needed for minor tweaks | P2: Config change without code build |

**Common Gaps:**
- No distributed tracing
- Static log levels
- No metrics endpoint
- Configuration hardcoded

**Mitigation Examples:**
- 6.1 (Tracing): Implement W3C Trace Context, add correlation IDs
- 6.2 (Logs): Use dynamic log levels, structured logging (JSON)
- 6.3 (Metrics): Expose /metrics endpoint, track RED metrics
- 6.4 (Config): Externalize config, use feature flags

---

## 7. QoS (Quality of Service) & QoE (Quality of Experience)

**Question:** How does it perform, and how does it feel?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 7.1 | **Latency (QoS):** What are the P95 and P99 latency targets? | Slow API responses affecting throughput | P3: P95 latency <Xs, P3: P99 latency <Ys |
| 7.2 | **Throttling (QoS):** Is there Rate Limiting to prevent "noisy neighbors" or DDoS? | Service degradation for all users | P2: Rate limiting enforced, P2: 429 returned when limit exceeded |
| 7.3 | **Perceived Performance (QoE):** Does the UI show optimistic updates or skeletons while loading? | App feels sluggish to the user | P2: Skeleton/spinner shown while loading |
| 7.4 | **Degradation (QoE):** If the service is slow, does it show a friendly message or a raw stack trace? | Poor user trust; frustration | P2: Friendly error message shown, P1: Error boundary catches exceptions |

**Common Gaps:**
- Latency targets undefined
- No rate limiting
- Poor perceived performance
- Raw error messages

**Mitigation Examples:**
- 7.1 (Latency): Define SLOs (P95 <2s, P99 <5s)
- 7.2 (Throttling): Implement rate limiting, return 429 with Retry-After
- 7.3 (Perceived Performance): Add skeleton screens, optimistic updates
- 7.4 (Degradation): Implement error boundaries, show friendly messages

---

## 8. Deployability

**Question:** How easily can we ship this?

| # | Criterion | Risk if Unmet | Typical Test Scenarios (P0-P2) |
|---|-----------|---------------|--------------------------------|
| 8.1 | **Zero Downtime:** Does the design support Blue/Green or Canary deployments? | Maintenance windows required (downtime) | P2: Blue/Green deployment works, P2: Canary deployment gradual rollout |
| 8.2 | **Backward Compatibility:** Can we deploy the DB changes separately from the Code changes? | "Lock-step" deployments; high risk of breaking changes | P2: DB migration before code deploy, P2: Code handles old and new schema |
| 8.3 | **Rollback:** Is there an automated rollback trigger if Health Checks fail post-deploy? | Prolonged outages after a bad deploy | P2: Health check fails → automated rollback |

**Common Gaps:**
- No zero-downtime strategy
- Tight coupling between DB and code
- No automated rollback

**Mitigation Examples:**
- 8.1 (Zero Downtime): Implement Blue/Green or Canary deployments
- 8.2 (Backward Compatibility): Separate DB migrations from code deploys
- 8.3 (Rollback): Automate rollback on health check failures

---

## Benefits

**For test-design workflow:**
- ✅ Standard NFR structure (same 8 categories every project)
- ✅ Clear testability requirements for Architecture team
- ✅ Direct mapping: criterion → requirement → test scenario
- ✅ Comprehensive coverage (29 criteria = no blind spots)

**For nfr-assess workflow:**
- ✅ Structured assessment (not ad-hoc)
- ✅ Quantifiable (X/29 criteria met)
- ✅ Evidence-based (each criterion has evidence field)
- ✅ Actionable (gaps → next actions with owners)

**For Architecture teams:**
- ✅ Clear checklist (29 yes/no questions)
- ✅ Risk-aware (each criterion has "risk if unmet")
- ✅ Scoped work (only implement what's needed)

**For QA teams:**
- ✅ Comprehensive test coverage (29 criteria → test scenarios)
- ✅ Clear priorities (P0 for security/isolation, P1 for monitoring)
- ✅ No ambiguity (each criterion has specific test scenarios)

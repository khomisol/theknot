# Workflow: Non-Functional Requirements Assessment (NR)

## Purpose
Assess and test non-functional requirements including performance, security, reliability, and scalability.

## Agent
Test Architect (TEA) - Tessa

## Command
`*nfr-assess`

---

## Prerequisites

- Architecture document available
- NFRs defined in PRD or requirements
- System deployed/deployable for testing

---

## NFR Categories

### Performance
- Response time
- Throughput
- Resource utilization

### Scalability  
- Load handling
- Horizontal/vertical scaling
- Data volume handling

### Reliability
- Availability (uptime)
- Fault tolerance
- Recovery time

### Security
- Authentication/Authorization
- Data protection
- Vulnerability assessment

### Usability
- Accessibility
- Learnability
- User satisfaction

---

## Process

### Step 1: Identify NFRs

**Extract from:**
- PRD quality requirements
- Architecture constraints
- SLAs/SLOs
- Compliance requirements

**Document each NFR:**
```markdown
| ID | Category | Requirement | Target | Priority |
|----|----------|-------------|--------|----------|
| NFR-1 | Performance | API response time | <200ms p95 | Critical |
| NFR-2 | Scalability | Concurrent users | 10,000 | High |
| NFR-3 | Reliability | Uptime | 99.9% | Critical |
```

### Step 2: Design Assessment Approach

**For each NFR category:**

#### Performance Testing
```javascript
// k6 load test example
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/endpoint');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

#### Security Testing
- OWASP Top 10 checklist
- Authentication/authorization tests
- Input validation tests
- Dependency vulnerability scan

#### Reliability Testing
- Chaos engineering experiments
- Failover testing
- Recovery testing
- Backup/restore verification

### Step 3: Execute Assessments

**Performance test execution:**
```bash
# Run load test
k6 run --out json=results.json performance.js

# Analyze results
k6 report results.json
```

**Security scan:**
```bash
# Dependency check
npm audit
# or
snyk test

# SAST scan
semgrep --config auto .
```

### Step 4: Analyze Results

**Performance analysis:**
- Compare against targets
- Identify bottlenecks
- Resource utilization patterns
- Degradation under load

**Create report:**
```markdown
## NFR Assessment Results

### Performance (NFR-1: API Response Time)
- **Target:** <200ms p95
- **Result:** 180ms p95 ✅
- **Details:** 
  - p50: 45ms
  - p95: 180ms
  - p99: 350ms
- **Bottleneck:** Database queries on /search endpoint

### Scalability (NFR-2: Concurrent Users)
- **Target:** 10,000 users
- **Result:** 8,500 users ⚠️
- **Details:** CPU saturation at 8,500 concurrent
- **Recommendation:** Add horizontal scaling trigger
```

### Step 5: Recommendations

**Prioritize findings:**
1. Critical gaps (below target)
2. Risks (close to target)
3. Improvements (optimization opportunities)

**Action items:**
- Specific remediation steps
- Architecture changes needed
- Monitoring requirements
- Retest schedule

---

## Output

- NFR assessment report
- Test scripts and configurations
- Gap analysis
- Remediation recommendations

---

## Tools by Category

### Performance
- **k6** - Modern load testing
- **Artillery** - Node.js load testing  
- **JMeter** - Java-based load testing
- **Gatling** - Scala-based load testing

### Security
- **OWASP ZAP** - Web app scanner
- **Snyk** - Dependency scanning
- **Semgrep** - Static analysis
- **Trivy** - Container scanning

### Reliability
- **Chaos Monkey** - Chaos engineering
- **Gremlin** - Failure injection
- **LitmusChaos** - Kubernetes chaos

### Monitoring
- **Prometheus** - Metrics
- **Grafana** - Visualization
- **Datadog** - APM
- **New Relic** - Observability

---

## NFR Checklist

### Performance
- [ ] Response time targets defined and tested
- [ ] Throughput limits identified
- [ ] Resource utilization acceptable
- [ ] Performance under load verified

### Security
- [ ] OWASP Top 10 addressed
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Dependencies scanned
- [ ] Secrets management verified

### Reliability
- [ ] Availability targets achievable
- [ ] Failover tested
- [ ] Recovery procedures verified
- [ ] Backup/restore tested
- [ ] Monitoring in place

---

## Next Steps

After NFR assessment:
- Address critical gaps
- Establish ongoing monitoring
- Schedule periodic reassessment
- `*ci` - Add NFR gates to pipeline

# Kiro Specs - Web Scraping Automation Platform

## Overview

This directory contains Kiro spec files for the Web Scraping Automation Platform. These specs follow the requirements-first workflow with property-based testing integration.

## Active Specs

### 1. Scraper API Core
**Location:** `.kiro/specs/scraper-api-core/`  
**Epic:** Epic 1 - Core API & Job Queue  
**Status:** Ready for implementation  
**Estimated Effort:** 38-54 hours

**Features:**
- REST API for job submission and status tracking
- Async job queue with concurrency control (max 3)
- SQLite database for job metadata
- API key authentication
- Health monitoring endpoint

**Key Files:**
- `requirements.md` - 6 user stories with acceptance criteria
- `design.md` - Architecture, API design, database schema, 6 correctness properties
- `tasks.md` - 12 task groups with 60+ individual tasks

### 2. TheKnot Site Adapter
**Location:** `.kiro/specs/theknot-adapter/`  
**Epic:** Epic 2 - TheKnot Site Adapter  
**Status:** Ready for implementation  
**Estimated Effort:** 32-47 hours

**Features:**
- Site-specific scraping adapter for TheKnot.com
- Browser automation with Playwright
- Data extraction (6 fields: name, location, rating, reviews, price, URL)
- Pagination handling (Next button)
- Rate limiting (2-4 seconds between pages)

**Key Files:**
- `requirements.md` - 6 user stories with acceptance criteria
- `design.md` - Adapter interface, implementation, 5 correctness properties
- `tasks.md` - 12 task groups with 60+ individual tasks

## Spec Workflow

### 1. Requirements Phase
- Define user stories with acceptance criteria
- Identify non-functional requirements
- Document technical constraints
- Define success metrics

### 2. Design Phase
- Create architecture diagrams
- Design API contracts
- Define database schemas
- Specify correctness properties for PBT
- Plan testing strategy

### 3. Tasks Phase
- Break down into implementable tasks
- Identify property-based test tasks
- Estimate effort
- Plan sprints
- Define dependencies

### 4. Implementation Phase
- Execute tasks sequentially
- Write unit tests
- Write property-based tests
- Update task status
- Document progress

## Property-Based Testing

### Correctness Properties

**Scraper API Core (6 properties):**
1. Job ID Uniqueness - Every job gets unique UUID
2. Job Status Transitions - Valid state machine (queued → running → completed/failed)
3. Concurrency Limit - Never >3 jobs running
4. Job Persistence - State survives restarts
5. API Authentication - All endpoints enforce auth
6. Response Time - Job submission <100ms

**TheKnot Adapter (5 properties):**
1. URL Format - Valid TheKnot marketplace URLs
2. Data Extraction Completeness - All 6 fields present
3. Pagination Termination - No infinite loops
4. Rate Limit Compliance - Delays ≥2 seconds
5. Missing Field Handling - Graceful handling, no errors

### Testing Framework
- **Unit/Integration:** Vitest
- **Property-Based:** fast-check
- **API Testing:** Supertest
- **Browser Testing:** Playwright Test
- **Coverage Target:** >80%

## Relationship to BMAD Documentation

### Existing BMAD Docs
- **PRD:** `scraper-automation-tool/docs/PRD.md` (100% complete)
- **Architecture:** `scraper-automation-tool/docs/architecture.md` (100% complete)
- **Epics:** `scraper-automation-tool/docs/epics.md` (100% complete)
- **Project Status:** `scraper-automation-tool/docs/PROJECT-STATUS.md` (81% complete)

### Kiro Specs (New)
- **Scraper API Core:** `.kiro/specs/scraper-api-core/` (requirements → design → tasks)
- **TheKnot Adapter:** `.kiro/specs/theknot-adapter/` (requirements → design → tasks)

### Integration
Kiro specs are **derived from** BMAD documentation:
- PRD → Requirements (user stories, acceptance criteria)
- Architecture → Design (system design, API contracts)
- Epics → Tasks (implementation breakdown)

Kiro specs **add**:
- Correctness properties for property-based testing
- Detailed task breakdowns with PBT tasks
- Test strategies and frameworks
- Sprint planning and effort estimates

## How to Use These Specs

### For Developers

**Starting a new feature:**
1. Read `requirements.md` to understand user stories
2. Review `design.md` for architecture and correctness properties
3. Follow `tasks.md` for implementation sequence
4. Write property-based tests for each correctness property
5. Update task status as you complete work

**Running property-based tests:**
```bash
# Run all tests
npm test

# Run specific PBT
npm test -- property-1.1

# Run with coverage
npm test -- --coverage
```

### For Project Managers

**Tracking progress:**
1. Check task status in `tasks.md` files
2. Review sprint planning sections
3. Monitor effort estimates vs actuals
4. Update `PROJECT-STATUS.md` with completion percentages

**Planning sprints:**
1. Use task dependencies to sequence work
2. Reference effort estimates for capacity planning
3. Group related tasks into sprints
4. Track velocity (story points per week)

### For QA/Testers

**Testing strategy:**
1. Review correctness properties in `design.md`
2. Verify property-based tests are implemented
3. Run integration tests for each epic
4. Validate against acceptance criteria in `requirements.md`
5. Perform manual testing as documented in `tasks.md`

## Future Specs

### Planned Specs (Not Yet Created)
- **Epic 3:** Data Export System
- **Epic 4:** Error Handling & Reliability
- **Epic 5:** n8n Integration
- **Epic 6:** CRM Integration
- **Epic 7:** Venue Detail Enrichment

### Creating New Specs

**Template structure:**
```
.kiro/specs/{feature-name}/
├── requirements.md  # User stories, acceptance criteria
├── design.md        # Architecture, correctness properties
└── tasks.md         # Implementation tasks, PBT tasks
```

**Process:**
1. Start with requirements (user stories)
2. Design architecture and define correctness properties
3. Break down into tasks with PBT tasks
4. Implement with property-based testing
5. Update task status as work progresses

## Cost Target

**Zero Recurring Costs:**
- $0/month infrastructure (runs on existing Windows PC)
- $0/month database (SQLite)
- $0/month job queue (in-memory)
- $0/month proxies (not needed for TheKnot)
- $0/month CAPTCHA (not needed for TheKnot)

**Total Savings:** $6,000-12,000/year vs BrowserAct

## Success Metrics

### Technical Metrics
- API response time <100ms ✅
- Job start time <5 seconds ✅
- 90%+ success rate ✅
- 3 concurrent jobs ✅
- >80% test coverage ✅

### Business Metrics
- Zero recurring costs ✅
- Matches BrowserAct output format ✅
- <5 minute setup time ✅
- n8n integration <1 hour ✅

## References

### BMAD Documentation
- PRD: `scraper-automation-tool/docs/PRD.md`
- Architecture: `scraper-automation-tool/docs/architecture.md`
- Epics: `scraper-automation-tool/docs/epics.md`
- Project Status: `scraper-automation-tool/docs/PROJECT-STATUS.md`

### Kiro Documentation
- Kiro Spec Workflow: (Kiro system prompt)
- Property-Based Testing: (Kiro system prompt)
- Task Management: (Kiro system prompt)

### External Resources
- Playwright: https://playwright.dev/
- Fastify: https://www.fastify.io/
- fast-check: https://fast-check.dev/
- Vitest: https://vitest.dev/

---

**Created:** January 26, 2026  
**Framework:** BMAD Universal 1.0.0 + Kiro Specs  
**Status:** Ready for implementation

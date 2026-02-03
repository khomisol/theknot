# Requirements: Scraper API Core

## Feature Overview
Core REST API and job queue system for the Web Scraping Automation Platform. Provides async job submission, status tracking, and result retrieval for scraping TheKnot.com wedding venues.

## User Stories

### 1. Job Submission
**As an** n8n user  
**I want to** submit scraping jobs via HTTP POST  
**So that** I can integrate scraping into my automation workflows

**Acceptance Criteria:**
1.1. POST /api/scrape endpoint accepts site, category, location, maxPages parameters
1.2. Returns jobId immediately (non-blocking, <100ms response time)
1.3. Validates parameters before queuing (returns 400 for invalid params)
1.4. Returns 202 Accepted with job details
1.5. Requires API key authentication (Bearer token)
1.6. Stores job in database with status 'queued'

### 2. Job Status Tracking
**As an** n8n user  
**I want to** poll job status  
**So that** I know when scraping is complete

**Acceptance Criteria:**
2.1. GET /api/jobs/:id returns current status (queued, running, completed, failed)
2.2. Running status shows progress (current page, items extracted, percent complete)
2.3. Completed status includes result summary (item count, pages scraped, download URL)
2.4. Failed status includes error message and screenshot URL
2.5. Returns 404 for non-existent job IDs
2.6. Requires API key authentication

### 3. Job Queue Processing
**As a** system  
**I want** async job execution with concurrency control  
**So that** multiple scrapes can be managed efficiently without blocking

**Acceptance Criteria:**
3.1. In-memory queue processes jobs FIFO
3.2. Maximum 3 concurrent jobs enforced
3.3. Job status updates persist to database
3.4. Jobs start within 5 seconds of queuing
3.5. Worker polls queue continuously
3.6. Failed jobs can be retried

### 4. Data Persistence
**As a** system  
**I want** persistent storage of job metadata  
**So that** job history is maintained across restarts

**Acceptance Criteria:**
4.1. SQLite database stores job records (id, site, status, parameters)
4.2. Job logs stored with timestamps and context
4.3. Screenshot metadata stored with file paths
4.4. Jobs queryable by status, site, date
4.5. Database file location: ./data/scraper.db
4.6. Database schema supports migrations

### 5. API Authentication
**As a** system administrator  
**I want** API key-based authentication  
**So that** only authorized users can submit jobs

**Acceptance Criteria:**
5.1. Bearer token authentication required for all endpoints
5.2. API key stored in environment variable (SCRAPER_API_KEY)
5.3. Returns 401 Unauthorized for missing/invalid API keys
5.4. API key validation happens before request processing
5.5. No rate limiting per API key (MVP - added in Epic 6)

### 6. Health Monitoring
**As a** system administrator  
**I want** a health check endpoint  
**So that** I can monitor system status

**Acceptance Criteria:**
6.1. GET /api/health returns 200 OK when system is healthy
6.2. Response includes version, uptime, job counts (queued, running, completed)
6.3. No authentication required for health check
6.4. Response time <50ms

## Non-Functional Requirements

### Performance
- API response time: <100ms for job submission
- Job start time: <5 seconds from queuing
- Database query time: <50ms for status checks
- Memory usage: <500MB per job
- Throughput: 3 concurrent jobs

### Reliability
- 99% uptime for API
- Automatic retry on transient failures
- Job state persisted to database
- Graceful shutdown (complete running jobs)

### Security
- API key authentication (Bearer token)
- No sensitive data in logs
- HTTPS in production (localhost HTTP for dev)
- Input validation on all parameters

### Cost
- $0/month infrastructure (runs on existing Windows PC)
- SQLite database (no managed database costs)
- In-memory queue (no Redis costs)

## Technical Constraints
- TypeScript + Node.js 20 LTS
- Fastify web framework
- SQLite database (default)
- In-memory job queue (MVP)
- Runs on Windows PC (localhost)

## Dependencies
- Fastify (API framework)
- better-sqlite3 (database)
- uuid (job ID generation)
- Winston (logging)

## Out of Scope
- Multi-user authentication (single API key)
- Real-time streaming (async job pattern only)
- Web dashboard (API-first)
- PostgreSQL support (future)
- BullMQ/Redis queue (future)
- Rate limiting per API key (Epic 6)
- Webhook support (Epic 6)

## Success Metrics
- API response time <100ms: ✅ Target
- Job start time <5 seconds: ✅ Target
- 3 concurrent jobs: ✅ Target
- 90%+ success rate: ✅ Target
- Zero recurring costs: ✅ Target

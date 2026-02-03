# Tasks: Scraper API Core

## Epic 1: Core API & Job Queue

### 1. Project Setup
- [ ] 1.1 Initialize TypeScript project with strict mode
- [ ] 1.2 Install dependencies (Fastify, better-sqlite3, uuid, Winston)
- [ ] 1.3 Configure ESLint and Prettier
- [ ] 1.4 Set up Vitest for testing
- [ ] 1.5 Create project directory structure

### 2. Database Layer
- [ ] 2.1 Create SQLite database schema (jobs, job_logs, screenshots tables)
- [ ] 2.2 Implement database connection module
- [ ] 2.3 Create database migration system
- [ ] 2.4 Implement job CRUD operations
- [ ] 2.5 Implement job log operations
- [ ] 2.6 Write unit tests for database operations

### 3. API Server
- [ ] 3.1 Set up Fastify server with TypeScript
- [ ] 3.2 Configure CORS for localhost
- [ ] 3.3 Implement API key authentication middleware
- [ ] 3.4 Create error handling middleware
- [ ] 3.5 Implement request validation
- [ ] 3.6 Write unit tests for middleware

### 4. Job Submission Endpoint
- [ ] 4.1 Implement POST /api/scrape endpoint
- [ ] 4.2 Add parameter validation (site, category, location, maxPages)
- [ ] 4.3 Generate unique job IDs (UUID v4)
- [ ] 4.4 Store job in database with status 'queued'
- [ ] 4.5 Return 202 Accepted with job details
- [ ] 4.6 Write integration tests for job submission
- [ ] 4.7 **PBT:** Property test for job ID uniqueness (Property 1.1)

### 5. Job Status Endpoint
- [ ] 5.1 Implement GET /api/jobs/:id endpoint
- [ ] 5.2 Query job from database
- [ ] 5.3 Format response based on job status (queued, running, completed, failed)
- [ ] 5.4 Return 404 for non-existent jobs
- [ ] 5.5 Write integration tests for status endpoint
- [ ] 5.6 **PBT:** Property test for status transitions (Property 1.2)

### 6. Job Queue System
- [ ] 6.1 Implement in-memory FIFO queue
- [ ] 6.2 Add concurrency control (max 3 concurrent jobs)
- [ ] 6.3 Implement job worker polling mechanism
- [ ] 6.4 Add job status updates (queued → running → completed/failed)
- [ ] 6.5 Implement job execution error handling
- [ ] 6.6 Write unit tests for queue operations
- [ ] 6.7 **PBT:** Property test for concurrency limit (Property 1.3)

### 7. Job Download Endpoint
- [ ] 7.1 Implement GET /api/jobs/:id/download endpoint
- [ ] 7.2 Read result file from disk
- [ ] 7.3 Set appropriate Content-Type (text/csv or application/json)
- [ ] 7.4 Set Content-Disposition header for file download
- [ ] 7.5 Return 404 if results not available
- [ ] 7.6 Write integration tests for download endpoint

### 8. Health Check Endpoint
- [ ] 8.1 Implement GET /api/health endpoint
- [ ] 8.2 Return system status (version, uptime)
- [ ] 8.3 Include job counts (queued, running, completed)
- [ ] 8.4 No authentication required
- [ ] 8.5 Write integration tests for health check

### 9. Logging System
- [ ] 9.1 Configure Winston logger
- [ ] 9.2 Implement structured logging (JSON format)
- [ ] 9.3 Add log levels (error, warn, info, debug)
- [ ] 9.4 Configure log file rotation
- [ ] 9.5 Add request logging middleware
- [ ] 9.6 Write unit tests for logging

### 10. Integration Testing
- [ ] 10.1 Write end-to-end API tests (submit → status → download)
- [ ] 10.2 Test authentication (valid/invalid API keys)
- [ ] 10.3 Test error scenarios (invalid parameters, missing jobs)
- [ ] 10.4 Test concurrent job processing
- [ ] 10.5 **PBT:** Property test for job persistence (Property 1.4)
- [ ] 10.6 **PBT:** Property test for API authentication (Property 1.5)
- [ ] 10.7 **PBT:** Property test for response time (Property 1.6)

### 11. Documentation
- [ ] 11.1 Write API documentation (OpenAPI spec)
- [ ] 11.2 Create README with setup instructions
- [ ] 11.3 Document environment variables
- [ ] 11.4 Add code comments for complex logic
- [ ] 11.5 Create troubleshooting guide

### 12. Performance Optimization
- [ ] 12.1 Optimize database queries (prepared statements)
- [ ] 12.2 Add database indexes (status, site, created_at)
- [ ] 12.3 Implement connection pooling
- [ ] 12.4 Profile API response times
- [ ] 12.5 Optimize job queue processing

## Property-Based Test Tasks

### PBT-1: Job ID Uniqueness (Property 1.1)
- [ ] PBT-1.1 Write property test using fast-check
- [ ] PBT-1.2 Generate 1000 jobs with random parameters
- [ ] PBT-1.3 Verify all job IDs are unique
- [ ] PBT-1.4 Run test 100 times with different seeds

### PBT-2: Job Status Transitions (Property 1.2)
- [ ] PBT-2.1 Write property test for valid state transitions
- [ ] PBT-2.2 Generate random job lifecycle events
- [ ] PBT-2.3 Verify status never transitions invalidly
- [ ] PBT-2.4 Test all valid paths (queued → running → completed/failed)

### PBT-3: Concurrency Limit (Property 1.3)
- [ ] PBT-3.1 Write property test for concurrent job limit
- [ ] PBT-3.2 Submit 10-100 jobs rapidly
- [ ] PBT-3.3 Monitor running job count continuously
- [ ] PBT-3.4 Verify count never exceeds 3

### PBT-4: Job Persistence (Property 1.4)
- [ ] PBT-4.1 Write property test for database persistence
- [ ] PBT-4.2 Submit jobs with random parameters
- [ ] PBT-4.3 Simulate process restart (close/reopen database)
- [ ] PBT-4.4 Verify all jobs still exist with correct data

### PBT-5: API Authentication (Property 1.5)
- [ ] PBT-5.1 Write property test for auth enforcement
- [ ] PBT-5.2 Generate random API keys (valid/invalid)
- [ ] PBT-5.3 Call all protected endpoints
- [ ] PBT-5.4 Verify 401 for invalid keys, 200/202 for valid

### PBT-6: Response Time (Property 1.6)
- [ ] PBT-6.1 Write property test for API performance
- [ ] PBT-6.2 Submit 100 jobs with random parameters
- [ ] PBT-6.3 Measure response time for each
- [ ] PBT-6.4 Verify p95 response time <100ms

## Task Dependencies

```
1 (Project Setup) → 2 (Database) → 3 (API Server)
3 → 4 (Job Submission) → 5 (Job Status)
3 → 6 (Job Queue) → 7 (Job Download)
3 → 8 (Health Check)
3 → 9 (Logging)
4, 5, 6, 7, 8 → 10 (Integration Testing)
10 → 11 (Documentation)
10 → 12 (Performance)
```

## Estimated Effort

| Task Group | Stories | Estimated Hours |
|------------|---------|-----------------|
| Project Setup | 1 | 2-3 hours |
| Database Layer | 2 | 4-6 hours |
| API Server | 3 | 3-4 hours |
| Job Submission | 4 | 4-6 hours |
| Job Status | 5 | 3-4 hours |
| Job Queue | 6 | 6-8 hours |
| Job Download | 7 | 2-3 hours |
| Health Check | 8 | 1-2 hours |
| Logging | 9 | 2-3 hours |
| Integration Testing | 10 | 6-8 hours |
| Documentation | 11 | 3-4 hours |
| Performance | 12 | 2-3 hours |
| **Total** | **12 groups** | **38-54 hours** |

## Sprint Planning

### Sprint 1 (Week 1)
- Tasks 1-3: Project setup, database, API server
- **Goal:** Basic API server with database

### Sprint 2 (Week 2)
- Tasks 4-6: Job submission, status, queue
- **Goal:** Core job processing working

### Sprint 3 (Week 3)
- Tasks 7-9: Download, health check, logging
- **Goal:** Complete API endpoints

### Sprint 4 (Week 4)
- Tasks 10-12: Testing, documentation, optimization
- **Goal:** Production-ready API

## Definition of Done

### Task Completion Criteria
- [ ] Code written and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (if applicable)
- [ ] Property-based tests written and passing (if applicable)
- [ ] Code documented (comments + README)
- [ ] No linting errors
- [ ] Performance targets met
- [ ] Manually tested in development environment

### Epic Completion Criteria
- [ ] All tasks completed
- [ ] All tests passing (100% pass rate)
- [ ] API documentation complete
- [ ] README with setup instructions
- [ ] Zero recurring costs achieved
- [ ] Performance targets met (<100ms response time)
- [ ] Integration with n8n tested (Epic 5)

## Notes

### Testing Framework
- **Unit/Integration:** Vitest
- **Property-Based:** fast-check
- **API Testing:** Supertest
- **Coverage:** >80% target

### Development Environment
- Node.js 20 LTS
- TypeScript 5.x (strict mode)
- Windows PC (localhost)
- SQLite database
- In-memory job queue

### Cost Target
- $0/month infrastructure
- All services running locally
- No external dependencies

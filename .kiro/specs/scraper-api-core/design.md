# Design: Scraper API Core

## Architecture Overview

### System Components
```
API Layer (Fastify)
├── POST /api/scrape - Submit job
├── GET /api/jobs/:id - Get status
├── GET /api/jobs/:id/download - Download results
├── GET /api/jobs - List jobs
└── GET /api/health - Health check

Job Processing
├── Job Queue (In-Memory FIFO)
├── Job Worker (Async Processor)
└── Concurrency Control (Max 3)

Data Layer
├── SQLite Database (Job metadata)
├── File Storage (CSV/JSON results)
└── Screenshot Storage (Error debugging)
```

### Data Flow
1. Client → POST /api/scrape → API validates → Job created (status: queued)
2. Worker polls queue → Job picked → Status: running
3. Worker executes scraping → Progress updates
4. Results saved to file → Job status: completed
5. Client → GET /api/jobs/:id → Returns status + download URL

## API Design

### Endpoint: POST /api/scrape
**Purpose:** Submit async scraping job

**Request:**
```typescript
POST /api/scrape
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "site": "theknot",
  "category": "wedding-reception-venues",
  "location": "los-angeles-ca",
  "maxPages": 5,
  "format": "csv"
}
```

**Response (202 Accepted):**
```typescript
{
  "jobId": "job_abc123",
  "status": "queued",
  "estimatedDuration": "2-5 minutes",
  "statusUrl": "/api/jobs/job_abc123"
}
```

**Validation Rules:**
- `site`: Required, must be "theknot" (MVP)
- `category`: Required, lowercase-with-hyphens format
- `location`: Required, lowercase-with-hyphens format
- `maxPages`: Optional, default 10, range 1-50
- `format`: Optional, "csv" or "json", default "csv"

### Endpoint: GET /api/jobs/:id
**Purpose:** Get job status and progress

**Response (Running):**
```typescript
{
  "jobId": "job_abc123",
  "status": "running",
  "site": "theknot",
  "progress": {
    "currentPage": 2,
    "totalPages": 5,
    "itemsExtracted": 48,
    "percentComplete": 40
  },
  "startedAt": "2026-01-25T10:01:00Z"
}
```

**Response (Completed):**
```typescript
{
  "jobId": "job_abc123",
  "status": "completed",
  "results": {
    "itemCount": 127,
    "pagesScraped": 5,
    "format": "csv",
    "downloadUrl": "/api/jobs/job_abc123/download"
  },
  "startedAt": "2026-01-25T10:01:00Z",
  "finishedAt": "2026-01-25T10:04:32Z",
  "duration": 212000
}
```

### Endpoint: GET /api/health
**Purpose:** System health check

**Response:**
```typescript
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 86400,
  "jobs": {
    "queued": 2,
    "running": 1,
    "completed": 127
  }
}
```

## Database Schema

### Table: jobs
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  site TEXT NOT NULL,
  status TEXT NOT NULL,
  parameters TEXT NOT NULL,
  pages_scraped INTEGER DEFAULT 0,
  items_extracted INTEGER DEFAULT 0,
  result_file_path TEXT,
  format TEXT DEFAULT 'csv',
  started_at INTEGER,
  finished_at INTEGER,
  duration_ms INTEGER,
  error_message TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_site ON jobs(site);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
```

### Table: job_logs
```sql
CREATE TABLE job_logs (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  context TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_job_logs_job_id ON job_logs(job_id);
```

### Table: screenshots
```sql
CREATE TABLE screenshots (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  context TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_screenshots_job_id ON screenshots(job_id);
```

## Job Queue Implementation

### In-Memory Queue (MVP)
```typescript
class JobQueue {
  private queue: Job[] = [];
  private running: Set<string> = new Set();
  private maxConcurrent = 3;

  async enqueue(job: Job): Promise<void> {
    this.queue.push(job);
    await this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.running.size >= this.maxConcurrent) return;
    if (this.queue.length === 0) return;

    const job = this.queue.shift()!;
    this.running.add(job.id);

    try {
      await this.executeJob(job);
    } finally {
      this.running.delete(job.id);
      await this.processNext();
    }
  }

  private async executeJob(job: Job): Promise<void> {
    // Update status to running
    await updateJobStatus(job.id, 'running');

    // Execute scraping (delegated to worker)
    await worker.execute(job);

    // Update status to completed
    await updateJobStatus(job.id, 'completed');
  }
}
```

## Authentication

### API Key Validation
```typescript
async function validateApiKey(request: FastifyRequest): Promise<boolean> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const validKey = process.env.SCRAPER_API_KEY;

  return token === validKey;
}

// Fastify hook
fastify.addHook('onRequest', async (request, reply) => {
  // Skip auth for health check
  if (request.url === '/api/health') return;

  const isValid = await validateApiKey(request);
  if (!isValid) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});
```

## Error Handling

### Error Response Format
```typescript
{
  "error": {
    "code": "INVALID_SITE",
    "message": "Site 'invalid' not supported. Available: theknot",
    "details": { /* optional context */ }
  }
}
```

### HTTP Status Codes
- 200: Success
- 202: Accepted (job queued)
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 404: Not Found (job not found)
- 500: Internal Server Error

## File Storage

### Directory Structure
```
data/
├── scraper.db (SQLite database)
├── jobs/
│   ├── job_abc123.csv
│   ├── job_abc123.json
│   └── job_xyz789.csv
├── screenshots/
│   └── job_abc123_error.png
└── logs/
    └── app.log
```

## Correctness Properties

### Property 1.1: Job ID Uniqueness
**Validates:** Requirements 1.1, 1.2  
**Property:** Every submitted job receives a unique job ID  
**Test Strategy:** Generate 1000 jobs, verify all IDs are unique (UUID v4)

### Property 1.2: Job Status Transitions
**Validates:** Requirements 2.1, 3.1  
**Property:** Job status follows valid state machine: queued → running → (completed | failed)  
**Test Strategy:** Submit jobs, verify status never transitions invalidly (e.g., completed → queued)

### Property 1.3: Concurrency Limit
**Validates:** Requirements 3.2  
**Property:** Never more than 3 jobs running concurrently  
**Test Strategy:** Submit 10 jobs rapidly, verify running count ≤ 3 at all times

### Property 1.4: Job Persistence
**Validates:** Requirements 4.1, 4.2  
**Property:** All job state persists to database and survives restarts  
**Test Strategy:** Submit job, kill process, restart, verify job still exists with correct status

### Property 1.5: API Authentication
**Validates:** Requirements 5.1, 5.3  
**Property:** All protected endpoints reject requests without valid API key  
**Test Strategy:** Call all endpoints without/with invalid API key, verify 401 responses

### Property 1.6: Response Time
**Validates:** Requirements 1.2, NFR Performance  
**Property:** Job submission responds in <100ms  
**Test Strategy:** Submit 100 jobs, measure response times, verify p95 <100ms

## Testing Strategy

### Unit Tests
- API endpoint handlers
- Job queue operations
- Database operations
- Authentication middleware
- Input validation

### Integration Tests
- Full API flow (submit → status → download)
- Database persistence
- Job queue processing
- Error handling

### Property-Based Tests
- Job ID uniqueness (Property 1.1)
- Status transitions (Property 1.2)
- Concurrency limits (Property 1.3)
- Job persistence (Property 1.4)
- API authentication (Property 1.5)
- Response time (Property 1.6)

### Test Framework
- **Unit/Integration:** Vitest
- **Property-Based:** fast-check
- **API Testing:** Supertest
- **Coverage Target:** >80%

## Performance Considerations

### Optimization Strategies
1. **Database:** Use prepared statements, batch inserts
2. **Queue:** In-memory for speed (no Redis overhead)
3. **API:** Fastify (fastest Node.js framework)
4. **Concurrency:** Limit to 3 to avoid resource exhaustion

### Resource Limits
- Memory: <500MB per job
- CPU: <50% per job
- Disk: Unlimited (local storage)

## Security Considerations

### Authentication
- API key in environment variable (not hardcoded)
- Bearer token in Authorization header
- No API key in logs or responses

### Input Validation
- Whitelist allowed sites ("theknot" only for MVP)
- Validate parameter formats (lowercase-with-hyphens)
- Limit maxPages (1-50 range)
- Sanitize file paths (prevent directory traversal)

### Data Protection
- No sensitive data stored (public business listings)
- HTTPS in production (localhost HTTP for dev)
- API key rotation supported

## Deployment

### Development (Localhost)
```bash
# Install dependencies
npm install

# Set API key
export SCRAPER_API_KEY=dev_key_12345

# Run in development mode
npm run dev

# API available at: http://localhost:3000
```

### Environment Variables
```bash
NODE_ENV=development
SCRAPER_API_KEY=your_api_key_here
DATABASE_PATH=./data/scraper.db
PORT=3000
LOG_LEVEL=info
```

## Monitoring

### Metrics to Track
- Job submission rate (jobs/minute)
- Job success rate (%)
- Average job duration (seconds)
- Queue depth (jobs waiting)
- Concurrent jobs (current count)
- API response times (p50, p95, p99)

### Logging
- Level: info (production), debug (development)
- Format: JSON (structured logging)
- Output: Console + file (./data/logs/app.log)
- Rotation: Daily, keep 7 days

## Future Enhancements

### Phase 2 (Epic 6)
- Webhook support (POST results to CRM)
- Rate limiting per API key (100 req/hour)
- PostgreSQL support (multi-instance)
- BullMQ + Redis (distributed queue)

### Phase 3
- Web dashboard (monitoring UI)
- Real-time updates (WebSocket)
- Job scheduling (cron-like)
- Multi-user authentication

## References
- PRD: scraper-automation-tool/docs/PRD.md
- Architecture: scraper-automation-tool/docs/architecture.md
- Epics: scraper-automation-tool/docs/epics.md
- Fastify Docs: https://www.fastify.io/
- fast-check Docs: https://fast-check.dev/

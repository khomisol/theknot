# Quick Start Guide

**Get your scraping API running in 2 minutes!**

---

## Prerequisites ✅

You already have:
- ✅ Node.js v24.12.0
- ✅ Docker Desktop (PostgreSQL running)
- ✅ All dependencies installed
- ✅ All tests passing

---

## Start the API (30 seconds)

### 1. Make sure PostgreSQL is running

```bash
docker ps
```

You should see `scraper-postgres` container running.

If not, start it:
```bash
cd scraper-automation-tool
docker-compose up -d
```

### 2. Start the API server

```bash
cd scraper-automation-tool
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL
✅ Database schema initialized
🚀 Job queue started (concurrency: 3)
🚀 Server listening on http://localhost:3000
```

**Your API is now running!** 🎉

---

## Test the API (1 minute)

### 1. Check health

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-25T..."
}
```

### 2. Submit a scraping job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d "{
    \"site\": \"theknot\",
    \"category\": \"wedding-reception-venues\",
    \"location\": \"los-angeles-ca\",
    \"maxPages\": 2,
    \"format\": \"csv\"
  }"
```

Response:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Job created successfully"
}
```

**Copy the `jobId` for the next step!**

### 3. Check job status

```bash
curl http://localhost:3000/api/jobs/YOUR_JOB_ID_HERE \
  -H "X-API-Key: test-api-key-12345"
```

Response (processing):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": {
    "currentPage": 1,
    "totalPages": 2,
    "itemsScraped": 2
  }
}
```

Response (completed):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": {
    "currentPage": 2,
    "totalPages": 2,
    "itemsScraped": 4
  },
  "outputFile": "data/550e8400-e29b-41d4-a716-446655440000.csv"
}
```

### 4. View the results

```bash
cat data/YOUR_JOB_ID_HERE.csv
```

You'll see CSV data with venue information!

---

## API Endpoints

### Health Check
```
GET /health
```
No authentication required.

### Submit Job
```
POST /api/jobs
Headers: X-API-Key: test-api-key-12345
Body: {
  "site": "theknot",
  "category": "wedding-reception-venues",
  "location": "los-angeles-ca",
  "maxPages": 2,
  "format": "csv" | "json"
}
```

### Get Job Status
```
GET /api/jobs/:id
Headers: X-API-Key: test-api-key-12345
```

### List Jobs
```
GET /api/jobs?status=completed&limit=10&offset=0
Headers: X-API-Key: test-api-key-12345
```

### Queue Statistics
```
GET /api/queue/stats
Headers: X-API-Key: test-api-key-12345
```

---

## API Keys

Default API key (from `.env`):
```
test-api-key-12345
```

To add more keys, edit `.env`:
```
API_KEYS=test-api-key-12345,your-key-here,another-key
```

Restart the server after changing `.env`.

---

## What's Working Right Now

✅ **REST API** - All endpoints functional  
✅ **Job Queue** - Automatic job processing  
✅ **Browser Automation** - Playwright with Chromium  
✅ **Data Export** - CSV and JSON formats  
✅ **Authentication** - API key protection  
✅ **Error Handling** - Screenshots on failure  
✅ **Progress Tracking** - Real-time status updates  

⚠️ **Mock Data** - Currently returns sample data (2 items per page)

---

## Next Steps

### Sprint 2: Real Scraping
The next sprint will implement real TheKnot.com scraping:
- Real URL building
- Actual data extraction
- Pagination handling
- Rate limiting

### Try It Yourself
1. Start the server: `npm run dev`
2. Submit a job with the curl command above
3. Check the status
4. View the CSV/JSON output

---

## Troubleshooting

### PostgreSQL not running
```bash
cd scraper-automation-tool
docker-compose up -d
```

### Port 3000 already in use
Edit `.env` and change `PORT=3000` to another port.

### API key not working
Check `.env` file has `API_KEYS=test-api-key-12345`

### Tests failing
```bash
npm test
```
All 15 tests should pass. If not, check PostgreSQL is running.

---

## Cost

**$0/month** - Everything runs locally on your PC!

No subscriptions, no credits, no limits.

---

## Documentation

- **[README.md](README.md)** - Project overview
- **[ZERO-COST-SETUP.md](ZERO-COST-SETUP.md)** - Detailed setup guide
- **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - Current status
- **[docs/PRD.md](docs/PRD.md)** - Product requirements
- **[docs/architecture.md](docs/architecture.md)** - System architecture
- **[docs/sprint-artifacts/SPRINT-1-COMPLETE.md](docs/sprint-artifacts/SPRINT-1-COMPLETE.md)** - Sprint 1 summary

---

**You're all set!** 🚀

Start the server and begin scraping for $0/month!

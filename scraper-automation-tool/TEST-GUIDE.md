# Testing Guide - Web Scraping Automation Platform

## 🚀 Quick Start Testing

### Prerequisites
- Docker Desktop running (for PostgreSQL)
- Node.js installed
- Terminal/Command Prompt

---

## Step 1: Start the Database

```bash
cd scraper-automation-tool
docker-compose up -d
```

**Expected output:**
```
✅ PostgreSQL container started
```

---

## Step 2: Start the API Server

```bash
npm run dev
```

---

## Step 3: Choose Your Testing Method

### 🌐 Method 1: HTML Web Interface (Easiest & Recommended)

**The platform includes a beautiful web interface for easy testing!**

1. **Open your browser:** `http://localhost:3000`

2. **You'll see a modern interface with:**
   - 📝 Job submission form with pre-filled defaults
   - 📊 Real-time status updates (polls every 2 seconds)
   - 📈 Progress bar showing pages scraped
   - 📋 Recent jobs list
   - 📥 One-click download button

3. **Submit a test job:**
   - Location: `seattle-wa` (pre-filled)
   - Category: `wedding-reception-venues` (pre-filled)
   - Max Pages: `2` (pre-filled)
   - Format: `csv` or `json`
   - API Key: `test-api-key-12345` (pre-filled)
   - Click "🚀 Start Scraping"

4. **Watch the magic happen:**
   - Status updates automatically
   - Progress bar fills as pages are scraped
   - Item count increases in real-time
   - Download button appears when complete

5. **Download results:**
   - Click "📥 Download Results" button
   - File opens in new tab or downloads automatically

**Features:**
- ✅ No command-line knowledge needed
- ✅ Visual feedback on job progress
- ✅ Easy job history browsing
- ✅ Clean, modern design
- ✅ Mobile-responsive

---

### 💻 Method 2: cURL (Command Line)

**Expected output:**
```
🚀 Server listening on http://localhost:3000
✅ Connected to PostgreSQL
✅ Database schema initialized
✅ Job queue started (concurrency: 3)
```

**Keep this terminal open!**

---

## Step 3: Test the API (New Terminal)

### Option A: Using curl (Command Line)

#### 1. Submit a Scraping Job

```bash
curl -X POST http://localhost:3000/api/scrape ^
  -H "X-API-Key: test-api-key-12345" ^
  -H "Content-Type: application/json" ^
  -d "{\"site\":\"theknot\",\"parameters\":{\"category\":\"wedding-reception-venues\",\"location\":\"seattle-wa\",\"maxPages\":2},\"format\":\"csv\"}"
```

**Expected response:**
```json
{
  "jobId": "abc123...",
  "status": "queued",
  "message": "Job submitted successfully"
}
```

**Copy the jobId!**

#### 2. Check Job Status

```bash
curl http://localhost:3000/api/jobs/YOUR_JOB_ID ^
  -H "X-API-Key: test-api-key-12345"
```

**Expected response (while running):**
```json
{
  "id": "abc123...",
  "status": "running",
  "progress": {
    "pages_scraped": 1,
    "items_extracted": 30
  }
}
```

**Expected response (completed):**
```json
{
  "id": "abc123...",
  "status": "completed",
  "result_file_path": "data/abc123.csv",
  "progress": {
    "pages_scraped": 2,
    "items_extracted": 60
  }
}
```

#### 3. View Results

```bash
# Open the CSV file
notepad data\YOUR_JOB_ID.csv

# Or view in terminal
type data\YOUR_JOB_ID.csv
```

---

### Option B: Using Postman (Visual Interface)

#### 1. Download Postman
- https://www.postman.com/downloads/

#### 2. Create a New Request

**Submit Job:**
- Method: `POST`
- URL: `http://localhost:3000/api/scrape`
- Headers:
  - `X-API-Key`: `test-api-key-12345`
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "site": "theknot",
  "parameters": {
    "category": "wedding-reception-venues",
    "location": "seattle-wa",
    "maxPages": 2
  },
  "format": "csv"
}
```

**Check Status:**
- Method: `GET`
- URL: `http://localhost:3000/api/jobs/{jobId}`
- Headers:
  - `X-API-Key`: `test-api-key-12345`

---

### Option C: Using Thunder Client (VS Code Extension)

#### 1. Install Thunder Client
- Open VS Code
- Extensions → Search "Thunder Client"
- Install

#### 2. Create Request
- Click Thunder Client icon
- New Request
- Same settings as Postman above

---

## 📊 What to Expect

### Timeline
1. **Job submitted** → Status: `queued` (instant)
2. **Job starts** → Status: `running` (1-2 seconds)
3. **Scraping page 1** → Progress updates (3-5 seconds)
4. **Delay** → Rate limiting (2-4 seconds)
5. **Scraping page 2** → Progress updates (3-5 seconds)
6. **Job completes** → Status: `completed` (total: ~15-20 seconds)

### Expected Results
- **2 pages scraped**
- **~60 venues extracted**
- **CSV file created** in `data/` folder
- **6 fields per venue:** name, location, rating, reviews, price, url

---

## 🎯 Test Scenarios

### Test 1: Basic Scraping (2 pages)
```json
{
  "site": "theknot",
  "parameters": {
    "location": "seattle-wa",
    "maxPages": 2
  },
  "format": "csv"
}
```

### Test 2: Different Location
```json
{
  "site": "theknot",
  "parameters": {
    "location": "los-angeles-ca",
    "maxPages": 3
  },
  "format": "json"
}
```

### Test 3: Single Page
```json
{
  "site": "theknot",
  "parameters": {
    "location": "new-york-ny",
    "maxPages": 1
  },
  "format": "csv"
}
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused"
**Solution:** Make sure server is running (`npm run dev`)

### Issue: "Unauthorized"
**Solution:** Add header `X-API-Key: test-api-key-12345`

### Issue: "Job failed"
**Solution:** Check server logs for error details

### Issue: Bot detection (HTTP2 error)
**Solution:** This is expected with headless browser. For testing:
1. Stop server
2. Edit `src/workers/job-worker.ts`
3. Change `headless: true` to `headless: false`
4. Restart server

---

## 📁 Where to Find Results

### CSV Files
```
scraper-automation-tool/data/{jobId}.csv
```

### JSON Files
```
scraper-automation-tool/data/{jobId}.json
```

### Screenshots (on errors)
```
scraper-automation-tool/data/screenshots/{jobId}-error.png
```

---

## 🔍 Monitoring

### Watch Server Logs
The terminal running `npm run dev` shows:
- Job submissions
- Scraping progress
- Page transitions
- Rate limiting delays
- Completion status

### Check Database
```bash
# Connect to PostgreSQL
docker exec -it scraper-db psql -U scraper -d scraper_db

# View jobs
SELECT id, site, status, created_at FROM jobs ORDER BY created_at DESC LIMIT 10;

# View logs
SELECT job_id, level, message, created_at FROM job_logs ORDER BY created_at DESC LIMIT 20;

# Exit
\q
```

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Server starts without errors
2. ✅ Job submission returns a jobId
3. ✅ Status changes from `queued` → `running` → `completed`
4. ✅ CSV/JSON file appears in `data/` folder
5. ✅ File contains venue data with 6 fields
6. ✅ Server logs show progress updates

---

## 🎉 Example Success Output

**Server logs:**
```
[INFO] Job abc123: Navigating to https://www.theknot.com/...
[INFO] Job abc123: Scraping page 1
[INFO] Job abc123: Found 30 venue cards
[INFO] Job abc123: Successfully extracted 30 venues
[INFO] Job abc123: Waiting 3.2s before next page...
[INFO] Job abc123: Navigating to next page...
[INFO] Job abc123: Scraping page 2
[INFO] Job abc123: Found 30 venue cards
[INFO] Job abc123: Successfully extracted 30 venues
[INFO] Job abc123: No more pages available
[INFO] Job abc123: Saving 60 items
[INFO] Job abc123: Job completed successfully
```

**CSV file (data/abc123.csv):**
```csv
name,location,rating,reviews,price,url
"Fremont Foundry","Seattle, WA",4.1,17,"Starting at $3,000",https://...
"THE 101","Seattle, WA",4.8,25,"Starting at $2,925",https://...
...
```

---

## 🚀 Next Steps

Once you've verified it works:
1. Try different locations
2. Adjust maxPages
3. Test JSON format
4. Check error handling (invalid location)
5. Monitor rate limiting in logs

---

## 💡 Tips

- **Start small:** Test with `maxPages: 1` first
- **Watch logs:** Server terminal shows everything
- **Be patient:** Rate limiting adds 2-4s delays between pages
- **Check files:** Results are in `data/` folder
- **Use Postman:** Easier than curl for repeated testing


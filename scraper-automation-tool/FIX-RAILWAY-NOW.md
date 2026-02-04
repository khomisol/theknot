# Fix Railway Deployment - Do This Now

## What's Wrong

From your screenshot, I can see these errors:
- ❌ `Failed to launch browser` - Playwright needs system dependencies
- ❌ `Connection refused` - Database not configured
- ❌ Build issues - Missing Docker configuration

## What I Fixed

I created these files for you:
1. ✅ `Dockerfile` - Includes Playwright with all dependencies
2. ✅ `railway.json` - Tells Railway how to build
3. ✅ `.dockerignore` - Optimizes build
4. ✅ Updated `package.json` - Fixed TypeScript dependency

## What You Need to Do (5 Minutes)

### 1️⃣ Add PostgreSQL Database (1 minute)

In your Railway dashboard:
1. Click **"+ New"**
2. Select **"Database"**
3. Click **"PostgreSQL"**
4. Wait 30 seconds for it to provision

**Result:** Railway automatically sets `DATABASE_URL` environment variable

### 2️⃣ Set API Key (1 minute)

In your Railway dashboard:
1. Click on your **scraper service** (not the database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   - **Name:** `API_KEYS`
   - **Value:** `your_secure_key_here` (change this!)

**Tip:** Generate a secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3️⃣ Push Code Changes (2 minutes)

```bash
# Navigate to project
cd scraper-automation-tool

# Add all new files
git add .

# Commit changes
git commit -m "Add Railway deployment configuration"

# Push to GitHub
git push origin main
```

**Result:** Railway automatically detects changes and starts redeploying

### 4️⃣ Wait for Deployment (3-5 minutes)

Watch the Railway logs. You should see:

```
📦 Building with Dockerfile...
⬇️  Downloading Playwright browsers...
🔨 Building TypeScript...
🚀 Starting application...
✅ Connected to PostgreSQL
✅ Database initialized
✅ Routes registered
✅ Job queue started
✅ Server listening on http://0.0.0.0:3000
```

### 5️⃣ Test It Works (1 minute)

```bash
# Replace with your Railway URL (find it in Railway dashboard)
curl https://your-app.railway.app/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2026-02-04T..."}
```

## Troubleshooting

### "DATABASE_URL is not defined"
→ Go back to Step 1, add PostgreSQL database

### "Failed to launch browser" (still)
→ Check Railway build logs, should say "Building with Dockerfile"

### "Cannot find module 'typescript'"
→ Make sure you pushed the updated `package.json`

### Build takes too long (>10 minutes)
→ First build is slow (downloads browsers), subsequent builds are faster

## What Changed

### Before (Broken)
- ❌ No Dockerfile → Railway couldn't install Playwright dependencies
- ❌ No DATABASE_URL → App couldn't connect to database
- ❌ TypeScript in devDependencies → Build failed

### After (Fixed)
- ✅ Dockerfile with Playwright image → All dependencies included
- ✅ PostgreSQL service → DATABASE_URL automatically set
- ✅ TypeScript in dependencies → Build succeeds

## Files I Created

```
scraper-automation-tool/
├── Dockerfile                      ← Docker build config
├── railway.json                    ← Railway deployment config
├── .dockerignore                   ← Build optimization
├── .env.railway                    ← Environment variables template
├── RAILWAY-DEPLOYMENT.md           ← Full deployment guide
├── RAILWAY-SETUP-CHECKLIST.md      ← Step-by-step checklist
├── RAILWAY-FIX-SUMMARY.md          ← Detailed fix summary
├── RAILWAY-QUICK-FIX.md            ← Quick reference
└── FIX-RAILWAY-NOW.md              ← This file
```

## Cost

**Free Tier:** ~$4-5/month (within $5 free credit)

Breakdown:
- Scraper service: ~$2-3/month
- PostgreSQL: ~$2/month

## After It's Working

Test the scraping:

```bash
# Submit a job
curl -X POST https://your-app.railway.app/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "site": "theknot",
    "location": "charlotte-nc",
    "category": "Reception Venues",
    "pages": 2,
    "format": "json"
  }'

# Response will include job_id
# {"jobId":"abc-123","status":"queued",...}

# Check job status
curl https://your-app.railway.app/api/jobs/abc-123 \
  -H "X-API-Key: your_api_key"
```

## Need More Help?

- **Quick Guide:** `RAILWAY-QUICK-FIX.md`
- **Full Guide:** `RAILWAY-DEPLOYMENT.md`
- **Checklist:** `RAILWAY-SETUP-CHECKLIST.md`
- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway

---

## TL;DR - Copy/Paste This

```bash
# 1. Add PostgreSQL in Railway dashboard (click + New → Database → PostgreSQL)

# 2. Add API_KEYS variable in Railway dashboard (Variables tab)

# 3. Push code
cd scraper-automation-tool
git add .
git commit -m "Add Railway deployment configuration"
git push origin main

# 4. Wait 5 minutes, then test
curl https://your-app.railway.app/health
```

**That's it! Your scraper will be running on Railway.** 🚀

---

**Created:** February 4, 2026  
**Status:** Ready to deploy ✅  
**Estimated time:** 5-10 minutes

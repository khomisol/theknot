# Railway Setup Checklist

Use this checklist to ensure your Railway deployment is configured correctly.

## ✅ Pre-Deployment Checklist

### 1. Files Created
- [ ] `Dockerfile` exists in project root
- [ ] `railway.json` exists in project root
- [ ] `.dockerignore` exists in project root
- [ ] `RAILWAY-DEPLOYMENT.md` guide available

### 2. Railway Project Setup
- [ ] Railway account created
- [ ] New project created in Railway
- [ ] GitHub repository connected to Railway

### 3. Database Setup
- [ ] PostgreSQL database added to Railway project
- [ ] `DATABASE_URL` environment variable automatically set
- [ ] Database is in same project as scraper service

### 4. Environment Variables Set

Go to Railway project → Service → Variables and add:

```bash
# Required
PORT=3000
API_KEYS=your_secure_key_here

# Optional (with defaults)
QUEUE_CONCURRENCY=3
QUEUE_POLL_INTERVAL=5000
LOG_LEVEL=info
```

**Note:** `DATABASE_URL` is automatically set by Railway PostgreSQL service.

### 5. Build Configuration
- [ ] Railway detects Dockerfile automatically
- [ ] Build command: (automatic from Dockerfile)
- [ ] Start command: `npm start`

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### Step 2: Railway Auto-Deploy
Railway will automatically:
1. Detect the Dockerfile
2. Build the Docker image
3. Install Playwright browsers
4. Start the service

### Step 3: Monitor Deployment
Watch the Railway logs for:
```
✅ Connected to PostgreSQL
✅ Database initialized
✅ Routes registered
✅ Job queue started
✅ Server listening on http://0.0.0.0:3000
```

### Step 4: Test the Deployment
```bash
# Get your Railway URL from the dashboard
export RAILWAY_URL="https://your-app.railway.app"

# Test health endpoint
curl $RAILWAY_URL/health

# Test scraping (replace API_KEY)
curl -X POST $RAILWAY_URL/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "site": "theknot",
    "location": "charlotte-nc",
    "category": "Reception Venues",
    "pages": 2,
    "format": "json"
  }'
```

## 🔍 Troubleshooting

### Issue: Build Fails

**Check:**
- [ ] `package.json` has `typescript` in dependencies
- [ ] `tsconfig.json` exists and is valid
- [ ] All imports are correct

**Fix:**
```bash
# Test build locally first
npm run build
```

### Issue: "Failed to launch browser"

**Check:**
- [ ] Dockerfile uses Playwright base image
- [ ] Playwright version matches in Dockerfile and package.json

**Current versions:**
- Dockerfile: `mcr.microsoft.com/playwright:v1.58.0-jammy`
- package.json: `"playwright": "^1.58.0"`

### Issue: Database Connection Failed

**Check:**
- [ ] PostgreSQL service is running in Railway
- [ ] `DATABASE_URL` is set in environment variables
- [ ] Database and scraper are in same Railway project

**Test connection:**
```bash
railway run psql $DATABASE_URL
```

### Issue: API Returns 401 Unauthorized

**Check:**
- [ ] `API_KEYS` environment variable is set
- [ ] Using correct API key in `X-API-Key` header

### Issue: Service Crashes on Startup

**Check Railway logs for:**
- Database connection errors
- Missing environment variables
- Port binding issues

**Common fixes:**
- Ensure `PORT` is set to 3000
- Ensure `DATABASE_URL` is set
- Check all required env vars are present

## 📊 Post-Deployment Verification

### 1. Service Health
- [ ] Service shows "Active" in Railway dashboard
- [ ] No crash loops in logs
- [ ] Health endpoint returns 200 OK

### 2. Database
- [ ] Tables created successfully
- [ ] Can query database via Railway CLI
- [ ] Indexes created

### 3. API Endpoints
- [ ] POST /api/scrape works
- [ ] GET /api/jobs/:id works
- [ ] GET /api/jobs works
- [ ] File downloads work

### 4. Scraping Functionality
- [ ] Can submit scraping job
- [ ] Job status updates correctly
- [ ] Results are saved to database
- [ ] CSV/JSON files are generated
- [ ] Can download result files

## 🎯 Performance Checks

### Response Times
- [ ] Health endpoint: < 50ms
- [ ] Submit job: < 200ms
- [ ] Get job status: < 100ms
- [ ] List jobs: < 200ms

### Scraping Performance
- [ ] Job starts within 5 seconds
- [ ] Scrapes 2 pages in < 30 seconds
- [ ] No memory leaks (check Railway metrics)
- [ ] Browser closes properly after job

## 🔐 Security Checks

- [ ] API keys are strong (20+ characters)
- [ ] API keys are not in code or git
- [ ] Database is not publicly accessible
- [ ] HTTPS is enabled (automatic on Railway)
- [ ] CORS is configured correctly

## 💰 Cost Monitoring

### Free Tier Usage
- [ ] Check Railway usage dashboard
- [ ] Monitor monthly credit usage
- [ ] Set up usage alerts

### Expected Usage (Free Tier)
- **Scraper Service:** ~100-200 hours/month
- **PostgreSQL:** ~100-200 hours/month
- **Total:** ~$2-4/month (within $5 free credit)

## 📝 Documentation

- [ ] Update README with Railway URL
- [ ] Document API endpoints
- [ ] Add example curl commands
- [ ] Share API keys securely with team

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Service is running without crashes
2. ✅ Database is connected and initialized
3. ✅ Can submit scraping jobs via API
4. ✅ Jobs complete successfully
5. ✅ Can download result files
6. ✅ Logs show no errors
7. ✅ Response times are acceptable
8. ✅ Within budget (free tier or expected cost)

---

## Quick Commands Reference

```bash
# View logs
railway logs

# Check status
railway status

# View environment variables
railway variables

# Connect to database
railway connect postgres

# Restart service
railway restart

# Run command in Railway environment
railway run [command]
```

## Need Help?

1. Check `RAILWAY-DEPLOYMENT.md` for detailed guide
2. Review Railway logs for error messages
3. Test locally first: `npm run dev`
4. Check Railway Discord: https://discord.gg/railway
5. Review Railway docs: https://docs.railway.app

---

**Last Updated:** February 4, 2026  
**Status:** Ready for deployment ✅

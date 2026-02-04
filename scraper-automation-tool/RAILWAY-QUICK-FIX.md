# 🚀 Railway Quick Fix Guide

## The Problem
Your scraper won't start on Railway due to:
1. Missing Playwright browser dependencies
2. Missing DATABASE_URL configuration
3. Missing Docker configuration

## The Solution (3 Steps)

### Step 1: Add PostgreSQL Database
1. Open your Railway project
2. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Wait for it to provision (30 seconds)

### Step 2: Set Environment Variables
1. Click on your scraper service
2. Go to **"Variables"** tab
3. Add this variable:
   ```
   API_KEYS=your_secure_key_here
   ```

### Step 3: Push Code Changes
```bash
cd scraper-automation-tool
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

## What Was Fixed

✅ **Created Dockerfile** - Uses Playwright image with all dependencies  
✅ **Created railway.json** - Tells Railway how to build  
✅ **Created .dockerignore** - Optimizes build  
✅ **Fixed package.json** - Moved TypeScript to dependencies  

## Verify It Works

After Railway redeploys (3-5 minutes), check logs for:

```
✅ Connected to PostgreSQL
✅ Database initialized
✅ Routes registered
✅ Job queue started
✅ Server listening on http://0.0.0.0:3000
```

Then test:
```bash
curl https://your-app.railway.app/health
# Should return: {"status":"ok"}
```

## Still Having Issues?

### Error: "DATABASE_URL is not defined"
→ Make sure PostgreSQL database is added to your Railway project

### Error: "Failed to launch browser"
→ Check Railway build logs - should say "Building with Dockerfile"

### Error: "Cannot find module 'typescript'"
→ Already fixed in package.json, push the changes

### Error: "Port already in use"
→ This is normal, Railway handles port assignment automatically

## Need More Help?

- **Full Guide:** See `RAILWAY-DEPLOYMENT.md`
- **Checklist:** See `RAILWAY-SETUP-CHECKLIST.md`
- **Summary:** See `RAILWAY-FIX-SUMMARY.md`

## Cost

**Free Tier:** ~$4-5/month (within $5 free credit)  
**Pro Tier:** ~$10-15/month (if you need more resources)

---

**That's it! Push the changes and Railway will handle the rest.** 🎉

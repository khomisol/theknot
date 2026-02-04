# Railway Deployment Guide

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository connected to Railway
3. PostgreSQL database provisioned in Railway

## Step 1: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a `DATABASE_URL` variable

## Step 2: Configure Environment Variables

In Railway project settings, add these variables:

```bash
# API Configuration
PORT=3000
API_KEYS=your_secure_api_key_here,another_key_here

# Database (automatically set by Railway PostgreSQL)
# DATABASE_URL=postgresql://... (already set)

# Queue Configuration
QUEUE_CONCURRENCY=3
QUEUE_POLL_INTERVAL=5000

# Logging
LOG_LEVEL=info

# Playwright (required for Railway)
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
```

## Step 3: Deploy

### Option A: Automatic Deployment (Recommended)

1. Push these new files to your GitHub repository:
   - `Dockerfile`
   - `railway.json`
   - `.dockerignore`

2. Railway will automatically detect the Dockerfile and deploy

### Option B: Manual Deployment

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Deploy:
   ```bash
   railway up
   ```

## Step 4: Verify Deployment

1. Check Railway logs for successful startup:
   ```
   ✅ Database initialized
   ✅ Routes registered
   ✅ Job queue started
   ✅ Server listening on http://0.0.0.0:3000
   ```

2. Test the API:
   ```bash
   curl https://your-app.railway.app/health
   ```

## Common Issues & Fixes

### Issue 1: "Failed to launch browser"

**Cause:** Playwright browser dependencies missing

**Fix:** The Dockerfile uses `mcr.microsoft.com/playwright:v1.58.0-jammy` which includes all dependencies.

If still failing, add to environment variables:
```bash
PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
```

### Issue 2: "Connection refused" to database

**Cause:** DATABASE_URL not set or incorrect

**Fix:** 
1. Ensure PostgreSQL service is running in Railway
2. Check that DATABASE_URL is automatically set
3. Verify connection string format:
   ```
   postgresql://user:password@host:port/database
   ```

### Issue 3: "Port already in use"

**Cause:** Railway assigns dynamic port

**Fix:** The app already uses `process.env.PORT` which Railway sets automatically.

### Issue 4: Build fails with "Cannot find module"

**Cause:** Missing dependencies or incorrect build

**Fix:**
1. Ensure `package.json` has all dependencies
2. Run locally first: `npm run build`
3. Check `tsconfig.json` is correct

### Issue 5: "Out of memory" during build

**Cause:** Railway free tier has memory limits

**Fix:**
1. Upgrade to Railway Pro ($5/month)
2. Or optimize build:
   ```json
   // In package.json
   "scripts": {
     "build": "tsc --incremental"
   }
   ```

## Monitoring

### View Logs
```bash
railway logs
```

### Check Metrics
1. Go to Railway dashboard
2. Click on your service
3. View **Metrics** tab for CPU, Memory, Network

### Database Queries
```bash
railway run psql $DATABASE_URL
```

## Scaling

### Horizontal Scaling (Multiple Instances)
Railway Pro supports replicas:
1. Go to service settings
2. Set **Replicas** to desired count
3. Note: Job queue needs Redis for distributed locking

### Vertical Scaling (More Resources)
Railway automatically scales resources based on usage.

## Cost Optimization

### Free Tier Limits
- $5 free credit per month
- ~500 hours of runtime
- 1GB RAM, 1 vCPU

### Estimated Costs (Pro Tier)
- **Scraper Service:** ~$5-10/month
- **PostgreSQL:** ~$5/month
- **Total:** ~$10-15/month

### Tips to Reduce Costs
1. Use **sleep mode** when not in use
2. Set **auto-sleep** after 1 hour of inactivity
3. Use **cron jobs** instead of always-on service
4. Optimize database queries (add indexes)

## Backup & Recovery

### Database Backups
Railway Pro includes automatic daily backups.

### Manual Backup
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

### Restore
```bash
railway run psql $DATABASE_URL < backup.sql
```

## Security

### API Keys
- Never commit `.env` file
- Use Railway environment variables
- Rotate keys regularly

### Database
- Railway PostgreSQL is private by default
- Only accessible from Railway services
- Use strong passwords

### HTTPS
- Railway provides automatic HTTPS
- Custom domains supported

## Troubleshooting Commands

### Check service status
```bash
railway status
```

### View environment variables
```bash
railway variables
```

### Connect to database
```bash
railway connect postgres
```

### Restart service
```bash
railway restart
```

### View build logs
```bash
railway logs --build
```

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Test scraping endpoint
3. ✅ Monitor logs for errors
4. ✅ Set up custom domain (optional)
5. ✅ Configure webhooks for job completion
6. ✅ Set up monitoring alerts

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: [Your GitHub Issues]

---

**Last Updated:** February 4, 2026  
**Railway Version:** v2  
**Playwright Version:** 1.58.0

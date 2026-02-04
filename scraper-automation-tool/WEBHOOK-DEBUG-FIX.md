# Webhook Notification Debug Fix

**Date:** February 4, 2026  
**Build ID:** 48cb848d-ad60-47f6-8f3f-d473d2c3fe1e  
**Status:** ✅ Deployed to Railway

## Problem

Webhook notifications were not being triggered even though the webhook code was implemented. The Railway logs showed no `[WEBHOOK]` messages when jobs completed.

## Root Cause

**Jobs were not being enqueued immediately with webhook_url**

The `/api/jobs` and `/api/scrape` endpoints were:
1. Creating jobs in the database with `webhook_url` ✅
2. **NOT** enqueuing jobs immediately ❌
3. Relying on the 5-second poll to pick up jobs from database

While the poll did include `webhook_url` when fetching from database, there was a potential race condition or the immediate enqueue was missing.

## Solution

### 1. Immediate Job Enqueue (Primary Fix)

**File:** `src/api/routes.ts`

Added immediate job enqueue after database creation (matching `/api/enrich` pattern):

```typescript
// Create job in database
await createJob({ ... });

// Add to queue immediately (don't wait for poll)
await jobQueue.enqueue({
  id: jobId,
  site,
  parameters,
  format,
  headless: headless ?? true,
  job_type: job_type || 'scrape',
  webhook_url: webhook_url || null, // ← Pass webhook_url
});
```

**Why this fixes it:**
- Jobs are enqueued immediately with all fields including `webhook_url`
- No waiting for 5-second poll
- Consistent with `/api/enrich` endpoint behavior

### 2. Enhanced Logging (Debug Aid)

**File:** `src/queue/job-queue.ts`

Added verbose logging to track webhook flow:

**On Enqueue:**
```typescript
console.log(`📥 Job ${job.id} enqueued (type: ${job.job_type || 'scrape'}, webhook: ${job.webhook_url ? 'YES' : 'NO'})`);
```

**On Completion:**
```typescript
if (job.webhook_url) {
  console.log(`[WEBHOOK] Job ${job.id} has webhook_url: ${job.webhook_url}`);
  console.log(`[WEBHOOK] Sending completion notification for job ${job.id}`);
  console.log(`[WEBHOOK] Payload preview: ${JSON.stringify(payload).substring(0, 200)}...`);
  // ... send webhook
} else {
  console.log(`[WEBHOOK] Job ${job.id} has NO webhook_url configured`);
}
```

**On Failure:**
```typescript
if (job.webhook_url) {
  console.log(`[WEBHOOK] Job ${job.id} has webhook_url: ${job.webhook_url}`);
  console.log(`[WEBHOOK] Sending failure notification for job ${job.id}`);
  console.log(`[WEBHOOK] Payload: ${JSON.stringify(payload)}`);
  // ... send webhook
} else {
  console.log(`[WEBHOOK] Job ${job.id} has NO webhook_url configured`);
}
```

## Expected Railway Logs (After Fix)

When you submit a job with webhook_url, you should now see:

```
📥 Job abc-123 enqueued (type: scrape, webhook: YES)
🚀 Job abc-123 started
[INFO] Job abc-123: Scraping page 1 of 2
[INFO] Job abc-123: Scraping page 2 of 2
✅ Job abc-123 completed (60 items, 48418ms)
[WEBHOOK] Job abc-123 has webhook_url: https://app.nimbusweb.me/automation/api/v1/webhooks/bfXpolSbHZkEElTyRSLHz
[WEBHOOK] Sending completion notification for job abc-123
[WEBHOOK] Payload preview: {"jobId":"abc-123","status":"completed","site":"theknot"...
[WEBHOOK] Sending notification to https://app.nimbusweb.me/automation/api/v1/webhooks/bfXpolSbHZkEElTyRSLHz
[WEBHOOK] Payload: {...full payload...}
[WEBHOOK] ✅ Notification sent successfully (200)
```

## Testing Instructions

### 1. Submit Job with Webhook

**Using curl:**
```bash
curl -X POST https://theknot-production.up.railway.app/api/jobs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d '{
    "site": "theknot",
    "parameters": {
      "location": "Charlotte, NC",
      "maxPages": 2
    },
    "format": "json",
    "webhook_url": "https://app.nimbusweb.me/automation/api/v1/webhooks/bfXpolSbHZkEElTyRSLHz"
  }'
```

**Using Frontend:**
1. Go to https://theknot-production.up.railway.app
2. Fill in scraping parameters
3. Add webhook URL: `https://app.nimbusweb.me/automation/api/v1/webhooks/bfXpolSbHZkEElTyRSLHz`
4. Click "Start Scraping"

### 2. Check Railway Logs

```bash
railway logs
```

Look for:
- `📥 Job ... enqueued (type: scrape, webhook: YES)` ← Confirms webhook_url passed
- `[WEBHOOK] Job ... has webhook_url: ...` ← Confirms webhook_url available at completion
- `[WEBHOOK] Sending notification to ...` ← Confirms webhook being sent
- `[WEBHOOK] ✅ Notification sent successfully (200)` ← Confirms delivery

### 3. Check Nimbus

Go to your Nimbus automation and verify the webhook was received with all 6 fields:
- Name
- Location
- Rating
- Reviews
- Price
- URL

## Files Changed

1. **src/api/routes.ts**
   - Added immediate job enqueue with webhook_url

2. **src/queue/job-queue.ts**
   - Enhanced webhook logging for debugging
   - Added webhook_url presence check in logs

## Deployment

- **Committed:** eece3b0
- **Pushed:** main branch
- **Deployed:** Railway Build ID `48cb848d-ad60-47f6-8f3f-d473d2c3fe1e`
- **URL:** https://theknot-production.up.railway.app

## Next Steps

1. Test with a real scraping job
2. Verify Railway logs show webhook messages
3. Verify Nimbus receives webhook notification
4. If still not working, check Railway logs for specific error messages

---

**Status:** Ready for testing

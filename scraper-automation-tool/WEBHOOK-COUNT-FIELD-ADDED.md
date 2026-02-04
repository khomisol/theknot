# Webhook Count Field Added

**Date:** February 4, 2026  
**Commit:** aa76c1a  
**Status:** ✅ Code pushed to GitHub (Railway deployment pending)

## Update Summary

Added `count` field to webhook payload to make it easier for Nimbus to loop through the data.

## New Webhook Structure

```json
{
  "jobId": "abc-123",
  "status": "completed",
  "site": "theknot",
  "timestamp": "2026-02-04T16:00:00.000Z",
  "data": {
    "count": 60,                    // ← NEW: Total number of venues
    "itemsExtracted": 60,
    "pagesScraped": 2,
    "durationMs": 45000,
    "resultFilePath": "data/abc-123.json",
    "name": ["Venue 1", "Venue 2", ...],      // 60 items
    "location": ["City 1", "City 2", ...],    // 60 items
    "rating": [4.9, 4.8, ...],                // 60 items
    "reviews": [245, 189, ...],               // 60 items
    "price": ["$$$$", "$$$", ...],            // 60 items
    "url": ["https://...", "https://...", ...] // 60 items
  }
}
```

## Benefits

### Before (Without Count)
```javascript
// Had to use array length
Loop count: {{1. Webhook Trigger body data name.length}}
```

### After (With Count)
```javascript
// Can use count directly
Loop count: {{1. Webhook Trigger body data count}}
```

## Nimbus Configuration (Updated)

### Step 1: Webhook Trigger
Receives the webhook with `body.data.count`

### Step 2: Loop Action
- **Loop Count:** `{{1. Webhook Trigger body data count}}`
- This will loop exactly 60 times (or however many venues were scraped)

### Step 3: Create Row (Inside Loop)
- **Name:** `{{1. Webhook Trigger body data name[Loop.index]}}`
- **Location:** `{{1. Webhook Trigger body data location[Loop.index]}}`
- **Rating:** `{{1. Webhook Trigger body data rating[Loop.index]}}`
- **Reviews:** `{{1. Webhook Trigger body data reviews[Loop.index]}}`
- **Price:** `{{1. Webhook Trigger body data price[Loop.index]}}`
- **URL:** `{{1. Webhook Trigger body data url[Loop.index]}}`

## Example Values

If you scrape 2 pages from Charlotte, NC:

```json
{
  "data": {
    "count": 60,              // ← Use this for loop count
    "itemsExtracted": 60,     // Same value, but count is clearer
    "pagesScraped": 2,
    "durationMs": 45000,
    "name": [
      "The Ballantyne Hotel",
      "The Mint Museum",
      "Salvatore's Ristorante",
      // ... 57 more venues
    ],
    "location": [
      "Charlotte, NC",
      "Charlotte, NC",
      "Charlotte, NC",
      // ... 57 more locations
    ],
    // ... other arrays
  }
}
```

## Deployment

### Code Status
- ✅ Code committed: aa76c1a
- ✅ Code pushed to GitHub
- ⏳ Railway deployment pending (CLI timeout)

### Manual Deployment
If Railway CLI continues to timeout, you can deploy manually:

1. Go to Railway dashboard: https://railway.app
2. Find your project: "theknot"
3. Click "Deploy" or wait for auto-deploy from GitHub
4. Verify deployment is live

### Verify Deployment
Once deployed, test with:
1. Go to https://theknot-production.up.railway.app
2. Submit a job with webhook URL
3. Check webhook payload includes `body.data.count`

## Testing

### Test Payload
```bash
curl -X POST https://app.nimbusweb.me/automation/api/v1/webhooks/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "status": "completed",
    "site": "theknot",
    "timestamp": "2026-02-04T16:00:00.000Z",
    "data": {
      "count": 3,
      "itemsExtracted": 3,
      "pagesScraped": 1,
      "durationMs": 10000,
      "resultFilePath": "data/test-123.json",
      "name": ["Venue A", "Venue B", "Venue C"],
      "location": ["City A", "City B", "City C"],
      "rating": [4.9, 4.8, 4.7],
      "reviews": [100, 200, 300],
      "price": ["$$$$", "$$$", "$$"],
      "url": ["https://a.com", "https://b.com", "https://c.com"]
    }
  }'
```

This should create 3 rows in your Nimbus database.

## Files Changed

**src/utils/webhook.ts**
- Added `count` field to `WebhookPayload` interface
- Set `count: result.items.length` in `createCompletedPayload()`

## Summary

- ✅ Added `body.data.count` field
- ✅ Makes Nimbus loop configuration easier
- ✅ Same value as `itemsExtracted`, but more explicit
- ⏳ Waiting for Railway deployment

---

**Next Steps:**
1. Wait for Railway to deploy (or deploy manually)
2. Test webhook with Nimbus
3. Verify `body.data.count` is accessible
4. Configure loop to use `{{body.data.count}}`

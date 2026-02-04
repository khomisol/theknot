# Webhook Integration Guide

## Overview
The scraper now supports webhook notifications that send scraped data to your specified URL when jobs complete or fail.

## Features
- ✅ Automatic notifications on job completion
- ✅ Automatic notifications on job failure
- ✅ Full scraped data included in payload
- ✅ Structured JSON format
- ✅ Retry logic with error handling

## How to Use

### 1. Submit Job with Webhook URL

**API Endpoint**: `POST /api/scrape`

**Request Body**:
```json
{
  "site": "theknot",
  "parameters": {
    "location": "charlotte-nc",
    "category": "wedding-reception-venues",
    "maxPages": 2
  },
  "format": "json",
  "headless": true,
  "webhook_url": "https://your-webhook-endpoint.com/webhook"
}
```

### 2. Receive Webhook Notifications

When the job completes, you'll receive a POST request to your webhook URL.

## Webhook Payload Structure

### Success Payload
```json
{
  "jobId": "d1759a6e-4ef9-4533-865f-855d6058cae6",
  "status": "completed",
  "site": "theknot",
  "timestamp": "2026-02-04T14:30:00.000Z",
  "data": {
    "itemsExtracted": 60,
    "pagesScraped": 2,
    "durationMs": 45000,
    "resultFilePath": "data/d1759a6e-4ef9-4533-865f-855d6058cae6.json",
    "items": [
      {
        "name": "The Venue Name",
        "location": "Charlotte, NC",
        "rating": 4.8,
        "reviews": 125,
        "price": "Starting at $5,000",
        "url": "https://www.theknot.com/marketplace/..."
      },
      // ... more items
    ]
  }
}
```

### Failure Payload
```json
{
  "jobId": "d1759a6e-4ef9-4533-865f-855d6058cae6",
  "status": "failed",
  "site": "theknot",
  "timestamp": "2026-02-04T14:30:00.000Z",
  "error": {
    "message": "Navigation timeout exceeded"
  }
}
```

## Data Fields Included

Each item in the `items` array contains:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Venue name | "The Glasshouse" |
| `location` | string | City and state | "Charlotte, NC" |
| `rating` | number \| string | Star rating or "New" | 4.8 or "New" |
| `reviews` | number | Number of reviews | 125 |
| `price` | string | Pricing information | "Starting at $5,000" |
| `url` | string | TheKnot venue URL | "https://www.theknot.com/..." |

## Integration Examples

### n8n Webhook Node
1. Add a **Webhook** node to your workflow
2. Set **HTTP Method** to `POST`
3. Copy the webhook URL
4. Use the URL in your scraping job request
5. Access data with `{{ $json.data.items }}`

### Make.com (Integromat)
1. Add a **Webhooks** module
2. Choose **Custom webhook**
3. Copy the webhook URL
4. Use the URL in your scraping job request
5. Parse the JSON response

### Zapier
1. Create a new Zap
2. Choose **Webhooks by Zapier** as trigger
3. Select **Catch Hook**
4. Copy the webhook URL
5. Use the URL in your scraping job request
6. Test the trigger to see the data structure

### Custom Server (Node.js/Express)
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { jobId, status, data } = req.body;
  
  if (status === 'completed') {
    console.log(`Job ${jobId} completed with ${data.itemsExtracted} items`);
    
    // Process the scraped data
    data.items.forEach(item => {
      console.log(`Venue: ${item.name} - ${item.location}`);
      // Insert into database, send to CRM, etc.
    });
  } else if (status === 'failed') {
    console.error(`Job ${jobId} failed: ${req.body.error.message}`);
  }
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

### Airtable Integration
```javascript
// In your webhook handler
const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'YOUR_API_KEY' }).base('YOUR_BASE_ID');

app.post('/webhook', async (req, res) => {
  const { data } = req.body;
  
  if (data && data.items) {
    // Insert each venue into Airtable
    for (const item of data.items) {
      await base('Venues').create({
        'Name': item.name,
        'Location': item.location,
        'Rating': item.rating,
        'Reviews': item.reviews,
        'Price': item.price,
        'URL': item.url
      });
    }
  }
  
  res.status(200).json({ received: true });
});
```

## Testing Your Webhook

### Using webhook.site
1. Go to https://webhook.site
2. Copy the unique URL
3. Use it as your `webhook_url` in the scraping request
4. View the received payload in real-time

### Using ngrok (Local Development)
```bash
# Start your local server
node server.js

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL as your webhook_url
# Example: https://abc123.ngrok.io/webhook
```

## Error Handling

### Webhook Delivery Failures
- If the webhook URL is unreachable, the error is logged but the job continues
- The scraped data is still saved to the database
- You can retrieve the data later via the API

### Retry Logic
- Currently: Single attempt (fire-and-forget)
- Future: Configurable retry with exponential backoff

## Security Best Practices

### 1. Use HTTPS
Always use HTTPS URLs for webhooks to ensure data is encrypted in transit.

### 2. Validate Webhook Signatures (Future)
```javascript
// Future feature: Verify webhook authenticity
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}
```

### 3. IP Whitelisting
Whitelist Railway's IP addresses in your firewall if needed.

### 4. Rate Limiting
Implement rate limiting on your webhook endpoint to prevent abuse.

## Troubleshooting

### Webhook Not Received
1. Check webhook URL is correct and accessible
2. Verify your server is running and listening
3. Check firewall rules
4. Review Railway logs: `railway logs`

### Invalid Data Format
1. Ensure your endpoint accepts `application/json`
2. Check the payload structure matches your expectations
3. Log the raw request body for debugging

### Timeout Issues
1. Webhook endpoint should respond quickly (< 5 seconds)
2. Process data asynchronously if needed
3. Return 200 OK immediately, then process

## API Reference

### Submit Job with Webhook
```bash
curl -X POST https://theknot-production.up.railway.app/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d '{
    "site": "theknot",
    "parameters": {
      "location": "charlotte-nc",
      "category": "wedding-reception-venues",
      "maxPages": 2
    },
    "format": "json",
    "webhook_url": "https://your-webhook-endpoint.com/webhook"
  }'
```

### Response
```json
{
  "jobId": "d1759a6e-4ef9-4533-865f-855d6058cae6",
  "status": "queued",
  "message": "Job queued successfully"
}
```

## Deployment
✅ **Live**: https://theknot-production.up.railway.app  
✅ **Build**: 2e26b9c5-bff2-4daf-add3-920ea2075543  
✅ **Status**: Webhook notifications enabled

## Next Steps
1. Test webhook with webhook.site
2. Integrate with your automation platform (n8n, Make, Zapier)
3. Build custom processing logic
4. Monitor webhook delivery in logs

---

**Created**: February 4, 2026  
**Feature**: Webhook notifications with full scraped data  
**Status**: ✅ Live and Ready to Use

# Webhook Sample Data - Quick Reference

## For Your Webhook Trigger Setup

### Single Venue (Copy this for trigger configuration)
```json
{
  "name": "The Glasshouse",
  "location": "Charlotte, NC",
  "rating": 4.8,
  "reviews": 125,
  "price": "Starting at $5,000",
  "url": "https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"
}
```

## The 6 Fields You Requested

| # | Field | Type | Description | Example |
|---|-------|------|-------------|---------|
| 1 | **Name** | String | Venue name | `"The Glasshouse"` |
| 2 | **Location** | String | City, State | `"Charlotte, NC"` |
| 3 | **Rating** | Number/String | Star rating or "New" | `4.8` or `"New"` |
| 4 | **Reviews** | Number | Review count | `125` |
| 5 | **Price** | String | Pricing info | `"Starting at $5,000"` |
| 6 | **URL** | String | TheKnot URL | `"https://www.theknot.com/..."` |

## Full Webhook Body Structure

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
        "name": "The Glasshouse",
        "location": "Charlotte, NC",
        "rating": 4.8,
        "reviews": 125,
        "price": "Starting at $5,000",
        "url": "https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"
      },
      {
        "name": "The Ballantyne Hotel",
        "location": "Charlotte, NC",
        "rating": 4.9,
        "reviews": 234,
        "price": "Starting at $8,000",
        "url": "https://www.theknot.com/marketplace/the-ballantyne-hotel-charlotte-nc-789012"
      },
      {
        "name": "Mint Museum Uptown",
        "location": "Charlotte, NC",
        "rating": "New",
        "reviews": 0,
        "price": "Contact for pricing",
        "url": "https://www.theknot.com/marketplace/mint-museum-uptown-charlotte-nc-345678"
      }
    ]
  }
}
```

## How to Access in Your Platform

### n8n
```javascript
// All venues
{{ $json.data.items }}

// First venue fields
{{ $json.data.items[0].name }}
{{ $json.data.items[0].location }}
{{ $json.data.items[0].rating }}
{{ $json.data.items[0].reviews }}
{{ $json.data.items[0].price }}
{{ $json.data.items[0].url }}
```

### Make.com
```
{{data.items[1].name}}
{{data.items[1].location}}
{{data.items[1].rating}}
{{data.items[1].reviews}}
{{data.items[1].price}}
{{data.items[1].url}}
```

### Zapier
```
Data Items 0 Name
Data Items 0 Location
Data Items 0 Rating
Data Items 0 Reviews
Data Items 0 Price
Data Items 0 URL
```

## Test Your Webhook

### Quick Test with webhook.site
1. Go to https://webhook.site
2. Copy the unique URL
3. Run this command:

```bash
curl -X POST https://theknot-production.up.railway.app/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d '{
    "site": "theknot",
    "parameters": {
      "location": "charlotte-nc",
      "maxPages": 1
    },
    "format": "json",
    "webhook_url": "YOUR_WEBHOOK_SITE_URL"
  }'
```

4. View the received data on webhook.site

## Files Available

| File | Purpose |
|------|---------|
| `WEBHOOK-SAMPLE-FOR-TRIGGER.json` | Single venue sample for trigger setup |
| `WEBHOOK-SAMPLE-DATA.json` | Full webhook body example |
| `WEBHOOK-BODY-STRUCTURE.md` | Complete field documentation |
| `WEBHOOK-TRIGGER-SETUP.md` | Platform-specific setup guides |
| `WEBHOOK-INTEGRATION.md` | Full integration guide |

## Quick Start

1. **Copy sample data** from `WEBHOOK-SAMPLE-FOR-TRIGGER.json`
2. **Paste into your webhook trigger** configuration
3. **Map the 6 fields** to your database/CRM
4. **Test with webhook.site** to verify
5. **Submit real job** with your webhook URL

---

**All 6 fields included**: Name, Location, Rating, Reviews, Price, URL  
**Status**: ✅ Ready to use  
**Date**: February 4, 2026

# Webhook Trigger Setup Guide

## Quick Start - Sample Data for Your Trigger

### Single Venue Item (Use this for trigger setup)
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

### Full Webhook Body (What you'll actually receive)
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
      }
    ]
  }
}
```

## Field Mapping for Your Database/CRM

| Your Field | Webhook Path | Type | Example |
|------------|--------------|------|---------|
| **Name** | `data.items[].name` | String | `"The Glasshouse"` |
| **Location** | `data.items[].location` | String | `"Charlotte, NC"` |
| **Rating** | `data.items[].rating` | Number/String | `4.8` or `"New"` |
| **Reviews** | `data.items[].reviews` | Number | `125` |
| **Price** | `data.items[].price` | String | `"Starting at $5,000"` |
| **URL** | `data.items[].url` | String | `"https://www.theknot.com/..."` |

## Platform-Specific Setup

### n8n Setup

#### Step 1: Add Webhook Node
1. Add a **Webhook** node to your workflow
2. Set **HTTP Method** to `POST`
3. Set **Path** to something like `/theknot-webhook`
4. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/theknot-webhook`)

#### Step 2: Test with Sample Data
Click "Listen for Test Event" and use this curl command:
```bash
curl -X POST https://your-n8n.com/webhook/theknot-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "status": "completed",
    "site": "theknot",
    "timestamp": "2026-02-04T14:30:00.000Z",
    "data": {
      "itemsExtracted": 2,
      "pagesScraped": 1,
      "durationMs": 30000,
      "items": [
        {
          "name": "The Glasshouse",
          "location": "Charlotte, NC",
          "rating": 4.8,
          "reviews": 125,
          "price": "Starting at $5,000",
          "url": "https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"
        }
      ]
    }
  }'
```

#### Step 3: Access Data in n8n
```javascript
// Get all venues
{{ $json.data.items }}

// Get first venue name
{{ $json.data.items[0].name }}

// Get first venue location
{{ $json.data.items[0].location }}

// Get first venue rating
{{ $json.data.items[0].rating }}

// Get first venue reviews
{{ $json.data.items[0].reviews }}

// Get first venue price
{{ $json.data.items[0].price }}

// Get first venue URL
{{ $json.data.items[0].url }}
```

#### Step 4: Loop Through Venues
Add a **Split In Batches** or **Loop Over Items** node:
- Input: `{{ $json.data.items }}`
- Each iteration will have one venue

#### Step 5: Insert into Database/CRM
Add your database node (Airtable, Google Sheets, PostgreSQL, etc.):
```javascript
{
  "Name": "{{ $json.name }}",
  "Location": "{{ $json.location }}",
  "Rating": "{{ $json.rating }}",
  "Reviews": "{{ $json.reviews }}",
  "Price": "{{ $json.price }}",
  "URL": "{{ $json.url }}"
}
```

### Make.com (Integromat) Setup

#### Step 1: Add Webhooks Module
1. Add **Webhooks** > **Custom webhook**
2. Click **Add** to create a new webhook
3. Copy the webhook URL

#### Step 2: Determine Data Structure
Click **Determine data structure** and paste this sample:
```json
{
  "jobId": "test-123",
  "status": "completed",
  "site": "theknot",
  "timestamp": "2026-02-04T14:30:00.000Z",
  "data": {
    "itemsExtracted": 2,
    "pagesScraped": 1,
    "durationMs": 30000,
    "items": [
      {
        "name": "The Glasshouse",
        "location": "Charlotte, NC",
        "rating": 4.8,
        "reviews": 125,
        "price": "Starting at $5,000",
        "url": "https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"
      }
    ]
  }
}
```

#### Step 3: Access Data
- Items array: `{{data.items}}`
- First venue name: `{{data.items[1].name}}`
- First venue location: `{{data.items[1].location}}`

Note: Make.com uses 1-based indexing!

#### Step 4: Iterate Over Venues
Add an **Iterator** module:
- Array: `{{data.items}}`
- Each iteration will have one venue

### Zapier Setup

#### Step 1: Create Zap
1. Choose **Webhooks by Zapier** as trigger
2. Select **Catch Hook**
3. Copy the webhook URL

#### Step 2: Test Trigger
Use this curl command to send test data:
```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_ID/ \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "status": "completed",
    "data": {
      "items": [
        {
          "name": "The Glasshouse",
          "location": "Charlotte, NC",
          "rating": 4.8,
          "reviews": 125,
          "price": "Starting at $5,000",
          "url": "https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"
        }
      ]
    }
  }'
```

#### Step 3: Access Data
Zapier will show you the data structure. Access fields like:
- `Data Items 0 Name`
- `Data Items 0 Location`
- `Data Items 0 Rating`

#### Step 4: Loop Through Items
Use **Looping by Zapier** to process each venue separately.

### Airtable Direct Integration

#### Step 1: Create Airtable Base
Create a table with these fields:
- Name (Single line text)
- Location (Single line text)
- Rating (Number or Single line text)
- Reviews (Number)
- Price (Single line text)
- URL (URL)

#### Step 2: Use n8n/Make to Insert
Example n8n workflow:
1. Webhook trigger
2. Split items array
3. Airtable node to create records

### Google Sheets Integration

#### Step 1: Create Sheet
Create columns:
- A: Name
- B: Location
- C: Rating
- D: Reviews
- E: Price
- F: URL

#### Step 2: Use n8n/Make to Append
Example n8n workflow:
1. Webhook trigger
2. Split items array
3. Google Sheets node to append rows

## Testing Your Setup

### Method 1: Use webhook.site
1. Go to https://webhook.site
2. Copy the unique URL
3. Submit a real scraping job with that URL
4. View the payload structure
5. Copy the structure to your automation tool

### Method 2: Use curl
```bash
# Test your webhook endpoint
curl -X POST https://your-webhook-url.com/webhook \
  -H "Content-Type: application/json" \
  -d @WEBHOOK-SAMPLE-DATA.json
```

### Method 3: Submit Real Job
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
    "webhook_url": "YOUR_WEBHOOK_URL_HERE"
  }'
```

## Common Patterns

### Pattern 1: Insert Each Venue into Database
```
Webhook → Split Items → Insert to Database
```

### Pattern 2: Send Email with Summary
```
Webhook → Format Data → Send Email
```

### Pattern 3: Filter by Rating
```
Webhook → Split Items → Filter (rating > 4.5) → Insert to Database
```

### Pattern 4: Enrich with Additional Data
```
Webhook → Split Items → HTTP Request (get more data) → Insert to Database
```

## Troubleshooting

### Issue: Can't see data structure
**Solution**: Use the sample JSON provided above to manually define the structure

### Issue: Items array is empty
**Solution**: Check if job completed successfully (status === "completed")

### Issue: Missing fields
**Solution**: Some venues may not have all fields. Use default values:
```javascript
const location = venue.location || "Location not available";
const rating = venue.rating || "No rating";
```

### Issue: Rating is string "New"
**Solution**: Check type before processing:
```javascript
if (typeof venue.rating === 'number') {
  // Numeric rating
} else {
  // "New" or missing
}
```

## Summary

### What You Need
1. ✅ Webhook URL from your automation platform
2. ✅ Sample data structure (provided above)
3. ✅ Field mappings (Name, Location, Rating, Reviews, Price, URL)

### What You'll Get
1. ✅ POST request with JSON body
2. ✅ Array of venue objects in `data.items`
3. ✅ All 6 fields for each venue
4. ✅ Job metadata (ID, status, duration)

### Next Steps
1. Set up webhook trigger in your platform
2. Use sample data to test
3. Submit real scraping job
4. Process the received data

---

**Created**: February 4, 2026  
**Purpose**: Complete webhook trigger setup guide  
**Status**: ✅ Ready to use

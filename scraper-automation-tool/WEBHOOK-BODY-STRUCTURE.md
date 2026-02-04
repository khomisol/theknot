# Webhook Body Structure - Complete Guide

## Overview
This document explains the exact structure of the webhook POST body you'll receive when a scraping job completes.

## HTTP Request Details

### Method
`POST`

### Headers
```
Content-Type: application/json
User-Agent: ScraperAutomationTool/1.0
```

### Body Structure

## Top-Level Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `jobId` | string | Unique job identifier (UUID) | `"d1759a6e-4ef9-4533-865f-855d6058cae6"` |
| `status` | string | Job status: `"completed"` or `"failed"` | `"completed"` |
| `site` | string | Scraping site identifier | `"theknot"` |
| `timestamp` | string | ISO 8601 timestamp | `"2026-02-04T14:30:00.000Z"` |
| `data` | object | Job results (only on success) | See below |
| `error` | object | Error details (only on failure) | See below |

## Success Response - `data` Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `itemsExtracted` | number | Total number of venues scraped | `60` |
| `pagesScraped` | number | Number of pages processed | `2` |
| `durationMs` | number | Job duration in milliseconds | `45000` |
| `resultFilePath` | string | Path to saved data file | `"data/abc-123.json"` |
| `items` | array | Array of scraped venue objects | See below |

## Venue Item Structure - `items[]` Array

Each item in the `items` array contains:

| Field | Type | Required | Description | Example Values |
|-------|------|----------|-------------|----------------|
| `name` | string | ✅ Yes | Venue name | `"The Glasshouse"` |
| `location` | string | ⚠️ Optional | City and state | `"Charlotte, NC"` |
| `rating` | number \| string | ⚠️ Optional | Star rating (1-5) or `"New"` | `4.8` or `"New"` |
| `reviews` | number | ⚠️ Optional | Number of reviews | `125` |
| `price` | string | ⚠️ Optional | Pricing information | `"Starting at $5,000"` |
| `url` | string | ✅ Yes | TheKnot venue URL | `"https://www.theknot.com/..."` |

### Field Details

#### `name` (Required)
- **Type**: String
- **Always Present**: Yes
- **Description**: The venue's display name
- **Examples**:
  - `"The Glasshouse"`
  - `"The Ballantyne Hotel"`
  - `"Mint Museum Uptown"`

#### `location` (Optional)
- **Type**: String
- **Format**: `"City, State"`
- **Always Present**: Usually (may be missing for some venues)
- **Examples**:
  - `"Charlotte, NC"`
  - `"Raleigh, NC"`
  - `"Asheville, NC"`

#### `rating` (Optional)
- **Type**: Number or String
- **Values**:
  - Number: `0` to `5.0` (star rating)
  - String: `"New"` (for new venues without ratings)
- **Always Present**: Usually (may be missing for some venues)
- **Examples**:
  - `4.8` (4.8 stars)
  - `5.0` (5 stars)
  - `"New"` (new venue)
  - `0` (no rating yet)

#### `reviews` (Optional)
- **Type**: Number
- **Always Present**: Usually (may be missing for some venues)
- **Description**: Total number of customer reviews
- **Examples**:
  - `125` (125 reviews)
  - `0` (no reviews yet)
  - `1543` (1,543 reviews)

#### `price` (Optional)
- **Type**: String
- **Always Present**: Usually (may be missing for some venues)
- **Description**: Pricing information as displayed on TheKnot
- **Examples**:
  - `"Starting at $5,000"`
  - `"Starting at $8,000"`
  - `"Contact for pricing"`
  - `"$$$"`

#### `url` (Required)
- **Type**: String
- **Always Present**: Yes
- **Description**: Full URL to the venue's page on TheKnot
- **Format**: `https://www.theknot.com/marketplace/{venue-slug}`
- **Examples**:
  - `"https://www.theknot.com/marketplace/the-glasshouse-charlotte-nc-123456"`
  - `"https://www.theknot.com/marketplace/the-ballantyne-hotel-charlotte-nc-789012"`

## Complete Example - Success

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

## Complete Example - Failure

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

## Accessing Data in Different Platforms

### n8n
```javascript
// Access the items array
{{ $json.data.items }}

// Access first venue name
{{ $json.data.items[0].name }}

// Access first venue location
{{ $json.data.items[0].location }}

// Loop through all items
{{ $json.data.items.map(item => item.name) }}
```

### Make.com (Integromat)
```
# Access items array
{{data.items}}

# Access first venue
{{data.items[1].name}}
{{data.items[1].location}}
{{data.items[1].rating}}
```

### Zapier
```
# Items are available as an array
# Use "Line Itemizer" to process each venue
data__items[]
```

### JavaScript/Node.js
```javascript
// Parse webhook body
const webhook = req.body;

// Check status
if (webhook.status === 'completed') {
  const venues = webhook.data.items;
  
  // Process each venue
  venues.forEach(venue => {
    console.log(`Name: ${venue.name}`);
    console.log(`Location: ${venue.location}`);
    console.log(`Rating: ${venue.rating}`);
    console.log(`Reviews: ${venue.reviews}`);
    console.log(`Price: ${venue.price}`);
    console.log(`URL: ${venue.url}`);
    console.log('---');
  });
}
```

### Python
```python
import json

# Parse webhook body
webhook = json.loads(request.body)

# Check status
if webhook['status'] == 'completed':
    venues = webhook['data']['items']
    
    # Process each venue
    for venue in venues:
        print(f"Name: {venue['name']}")
        print(f"Location: {venue.get('location', 'N/A')}")
        print(f"Rating: {venue.get('rating', 'N/A')}")
        print(f"Reviews: {venue.get('reviews', 0)}")
        print(f"Price: {venue.get('price', 'N/A')}")
        print(f"URL: {venue['url']}")
        print('---')
```

## Data Validation

### Required Fields
Always present:
- ✅ `jobId`
- ✅ `status`
- ✅ `site`
- ✅ `timestamp`
- ✅ `data.items[].name`
- ✅ `data.items[].url`

### Optional Fields
May be missing:
- ⚠️ `data.items[].location`
- ⚠️ `data.items[].rating`
- ⚠️ `data.items[].reviews`
- ⚠️ `data.items[].price`

### Handling Missing Fields

**JavaScript:**
```javascript
const location = venue.location || 'Location not available';
const rating = venue.rating || 'No rating';
const reviews = venue.reviews || 0;
const price = venue.price || 'Contact for pricing';
```

**Python:**
```python
location = venue.get('location', 'Location not available')
rating = venue.get('rating', 'No rating')
reviews = venue.get('reviews', 0)
price = venue.get('price', 'Contact for pricing')
```

## Testing Your Webhook

### 1. Use webhook.site
1. Go to https://webhook.site
2. Copy the unique URL
3. Submit a scraping job with that URL
4. View the received payload in real-time

### 2. Use RequestBin
1. Go to https://requestbin.com
2. Create a new bin
3. Use the bin URL as your webhook URL
4. View the received payload

### 3. Use ngrok (Local Testing)
```bash
# Start your local server
node server.js

# In another terminal
ngrok http 3000

# Use the ngrok URL as webhook_url
```

## Common Issues

### Issue: Missing Fields
**Problem**: Some venues don't have all fields  
**Solution**: Always check if field exists before using it

### Issue: Rating is String
**Problem**: Rating can be `"New"` instead of a number  
**Solution**: Check type before processing
```javascript
if (typeof venue.rating === 'number') {
  // It's a numeric rating
} else if (venue.rating === 'New') {
  // It's a new venue
}
```

### Issue: Large Payload
**Problem**: Many venues = large JSON payload  
**Solution**: Process items in batches or stream processing

## Summary

### What You'll Receive
- ✅ Complete venue data for all scraped items
- ✅ Name, Location, Rating, Reviews, Price, URL
- ✅ Job metadata (ID, status, duration, etc.)
- ✅ Structured JSON format

### What to Expect
- 📦 POST request to your webhook URL
- 📦 JSON body with all data
- 📦 Immediate delivery after job completes
- 📦 One webhook per job

---

**Created**: February 4, 2026  
**Purpose**: Complete webhook body structure reference  
**Status**: ✅ Ready for integration

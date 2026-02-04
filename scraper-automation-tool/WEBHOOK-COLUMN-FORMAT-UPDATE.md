# Webhook Column Format Update

**Date:** February 4, 2026  
**Build ID:** f1f233c5-a3a6-454f-b9d5-54f84cef9647  
**Status:** ✅ Deployed to Railway

## Change Summary

Updated webhook payload structure to use **column arrays** instead of row objects. This makes it easier to insert data into databases like Airtable, Google Sheets, or Nimbus.

## Old Format (Row-Based)

```json
{
  "jobId": "abc-123",
  "status": "completed",
  "site": "theknot",
  "timestamp": "2026-02-04T15:30:00.000Z",
  "data": {
    "itemsExtracted": 60,
    "pagesScraped": 2,
    "durationMs": 45489,
    "resultFilePath": "data/abc-123.json",
    "items": [
      {
        "name": "The Ballantyne Hotel",
        "location": "Charlotte, NC",
        "rating": 4.9,
        "reviews": 245,
        "price": "$$$$",
        "url": "https://www.theknot.com/marketplace/..."
      },
      {
        "name": "The Mint Museum",
        "location": "Charlotte, NC",
        "rating": 4.8,
        "reviews": 189,
        "price": "$$$",
        "url": "https://www.theknot.com/marketplace/..."
      }
      // ... 58 more venues
    ]
  }
}
```

## New Format (Column-Based) ✅

```json
{
  "jobId": "abc-123",
  "status": "completed",
  "site": "theknot",
  "timestamp": "2026-02-04T15:30:00.000Z",
  "data": {
    "itemsExtracted": 60,
    "pagesScraped": 2,
    "durationMs": 45489,
    "resultFilePath": "data/abc-123.json",
    "name": [
      "The Ballantyne Hotel",
      "The Mint Museum",
      "Salvatore's Ristorante",
      // ... 57 more names
    ],
    "location": [
      "Charlotte, NC",
      "Charlotte, NC",
      "Charlotte, NC",
      // ... 57 more locations
    ],
    "rating": [
      4.9,
      4.8,
      4.7,
      // ... 57 more ratings
    ],
    "reviews": [
      245,
      189,
      156,
      // ... 57 more review counts
    ],
    "price": [
      "$$$$",
      "$$$",
      "$$$",
      // ... 57 more prices
    ],
    "url": [
      "https://www.theknot.com/marketplace/the-ballantyne-hotel...",
      "https://www.theknot.com/marketplace/the-mint-museum...",
      "https://www.theknot.com/marketplace/salvatores-ristorante...",
      // ... 57 more URLs
    ]
  }
}
```

## Benefits

### 1. Easier Database Insertion
Column format matches how databases store data:
- Each array represents a column
- Index position represents the row
- Direct mapping to database columns

### 2. Nimbus/Airtable Compatible
Most automation tools expect column arrays:
```javascript
// Easy to map in Nimbus
data.name[0] → First venue name
data.location[0] → First venue location
data.rating[0] → First venue rating
```

### 3. Bulk Operations
Easier to perform bulk operations:
```javascript
// Get all names
const allNames = data.name;

// Get all ratings above 4.5
const highRated = data.rating.filter(r => r > 4.5);

// Count venues by price
const expensive = data.price.filter(p => p === '$$$$').length;
```

## Data Structure

### Column Arrays

Each array has the same length (equal to `itemsExtracted`):

1. **name** (string[]) - Venue names
2. **location** (string[]) - City, State format
3. **rating** ((number | "New")[]) - Rating 0-5 or "New"
4. **reviews** (number[]) - Number of reviews
5. **price** (string[]) - Price range ($, $$, $$$, $$$$)
6. **url** (string[]) - Full venue URLs

### Accessing Data

To get a complete venue record at index `i`:

```javascript
const venue = {
  name: data.name[i],
  location: data.location[i],
  rating: data.rating[i],
  reviews: data.reviews[i],
  price: data.price[i],
  url: data.url[i]
};
```

## Example: Nimbus Integration

### Create Rows in Database

In Nimbus, you can now easily create rows:

```javascript
// Loop through all venues
for (let i = 0; i < data.itemsExtracted; i++) {
  createRow({
    Name: data.name[i],
    Location: data.location[i],
    Rating: data.rating[i],
    Reviews: data.reviews[i],
    Price: data.price[i],
    URL: data.url[i]
  });
}
```

### Or Bulk Insert

```javascript
// Bulk insert all at once
bulkInsert({
  columns: ['Name', 'Location', 'Rating', 'Reviews', 'Price', 'URL'],
  data: [
    data.name,
    data.location,
    data.rating,
    data.reviews,
    data.price,
    data.url
  ]
});
```

## Testing

### Step 1: Submit Job with Webhook

Go to: https://theknot-production.up.railway.app

Fill in:
- Location: Charlotte, NC
- Category: Reception Venues
- Pages: 2
- Format: JSON
- Webhook URL: `https://app.nimbusweb.me/automation/api/v1/webhooks/bfXpolSbHZkEElTyRSLHz`

### Step 2: Verify Payload Structure

Check that webhook payload has:
```json
{
  "data": {
    "name": [...],
    "location": [...],
    "rating": [...],
    "reviews": [...],
    "price": [...],
    "url": [...]
  }
}
```

### Step 3: Access in Nimbus

In your Nimbus automation:
- `body.data.name` → Array of all venue names
- `body.data.location` → Array of all locations
- `body.data.rating` → Array of all ratings
- `body.data.reviews` → Array of all review counts
- `body.data.price` → Array of all prices
- `body.data.url` → Array of all URLs

## Files Changed

**src/utils/webhook.ts**
- Updated `WebhookPayload` interface to use column arrays
- Modified `createCompletedPayload()` to transform items into columns

## Deployment

- **Committed:** 3635479
- **Pushed:** main branch
- **Deployed:** Railway Build ID `f1f233c5-a3a6-454f-b9d5-54f84cef9647`
- **URL:** https://theknot-production.up.railway.app

---

**Status:** Ready for testing  
**Format:** Column arrays (database-friendly)  
**Access:** `body.data.name[i]`, `body.data.location[i]`, etc.

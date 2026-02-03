# Requirements: TheKnot Site Adapter

## Feature Overview
Site-specific scraping adapter for TheKnot.com wedding venues. Implements browser automation, data extraction, pagination handling, and rate limiting for respectful scraping of public business listings.

## User Stories

### 1. Venue Data Extraction
**As a** wedding vendor CRM owner  
**I want to** scrape TheKnot venues with 6 data fields  
**So that** I can build my lead database

**Acceptance Criteria:**
1.1. Extracts venue name from listing cards
1.2. Extracts location (city, state) from listing cards
1.3. Extracts star rating (0.0-5.0) from listing cards
1.4. Extracts review count (integer) from listing cards
1.5. Extracts starting price (string with $) from listing cards
1.6. Extracts profile URL (full HTTPS URL) from listing cards
1.7. Handles missing fields gracefully (returns empty string or 0)
1.8. Waits for vendor cards to load before extraction

### 2. URL Building
**As a** system  
**I want to** build TheKnot URLs from parameters  
**So that** I can navigate to the correct search results

**Acceptance Criteria:**
2.1. Accepts category parameter (e.g., "wedding-reception-venues")
2.2. Accepts location parameter (e.g., "los-angeles-ca")
2.3. Builds URL: `https://www.theknot.com/marketplace/{category}-{location}`
2.4. Validates parameters are lowercase-with-hyphens format
2.5. Returns validation error for invalid formats

### 3. Pagination Handling
**As a** system  
**I want to** automatically navigate through multiple pages  
**So that** I can scrape entire datasets without manual intervention

**Acceptance Criteria:**
3.1. Finds "Next" button using aria-label="Next" selector
3.2. Checks if Next button exists and is enabled
3.3. Clicks Next button and waits for page load
3.4. Returns true if pagination successful, false if no more pages
3.5. Respects maxPages limit from job parameters
3.6. Detects end of pagination automatically

### 4. Rate Limiting
**As a** responsible scraper  
**I want to** respect rate limits  
**So that** I don't get blocked or overwhelm the target site

**Acceptance Criteria:**
4.1. Implements 2-4 second delays between page requests
4.2. Adds random jitter (±500ms) to appear more human
4.3. Waits for network idle after navigation
4.4. Configurable rate limit per adapter (getRateLimit() method)
4.5. No requests faster than configured rate limit

### 5. Browser Automation
**As a** system  
**I want** reliable browser automation  
**So that** scraping works consistently

**Acceptance Criteria:**
5.1. Launches Chromium in headless mode
5.2. Navigates to TheKnot search results page
5.3. Waits for dynamic content to load (vendor cards)
5.4. Handles popups and dialogs automatically
5.5. Captures screenshots on errors
5.6. Closes browser properly after scraping

### 6. Site Adapter Interface
**As a** developer  
**I want** a consistent adapter interface  
**So that** I can add new sites easily

**Acceptance Criteria:**
6.1. Implements SiteAdapter interface (name, buildUrl, extractData, handlePagination, getRateLimit)
6.2. Adapter name is "theknot"
6.3. All interface methods implemented
6.4. Type-safe with TypeScript
6.5. Registered in adapter registry

## Non-Functional Requirements

### Performance
- Page scraping: <10 seconds per page
- Data extraction: <2 seconds per page
- Memory usage: <300MB per browser instance
- Browser launch: <3 seconds

### Reliability
- 90%+ success rate on TheKnot scraping
- Handles missing fields gracefully
- Automatic retry on transient failures (handled by Epic 4)
- Screenshot capture on errors

### Respectful Scraping
- 2-4 second delays between pages
- Random jitter to appear human
- Standard user agent (no deception)
- Public data only (no authentication bypass)
- Respects robots.txt

### Cost
- $0/month (no proxies needed)
- $0/month (no CAPTCHA solving needed)
- $0/month (no residential IPs needed)
- TheKnot allows datacenter IPs

## Technical Constraints
- Playwright with Chromium only
- CSS selectors for element targeting
- Headless mode (no GUI)
- Runs on Windows PC
- No anti-detection needed (TheKnot doesn't block)

## Dependencies
- Playwright (browser automation)
- Chromium (browser engine)
- Job worker (from Epic 1)
- Database (from Epic 1)

## Out of Scope
- Multiple browser support (Firefox, WebKit)
- Proxy rotation (not needed for TheKnot)
- CAPTCHA solving (not needed for TheKnot)
- Stealth/anti-detection (not needed for TheKnot)
- Authentication bypass (public data only)
- Other sites (Yelp, Google Maps - future)

## Success Metrics
- 90%+ success rate: ✅ Target
- <10 seconds per page: ✅ Target
- All 6 fields extracted: ✅ Target
- Pagination works: ✅ Target
- No blocking observed: ✅ Target

## TheKnot Specifics

### Target URL Pattern
```
https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca
```

### HTML Structure (as of January 2026)
```html
<div class="vendor-card">
  <a class="vendor-link" href="/venue-profile-url">
    <div class="vendor-name">The Grand Ballroom</div>
    <div class="vendor-location">Los Angeles, CA</div>
    <div class="rating-value">4.8</div>
    <div class="review-count">127 reviews</div>
    <div class="starting-price">Starting at $5,000</div>
  </a>
</div>

<button aria-label="Next">Next</button>
```

### Data Fields
1. **Venue Name:** Text content of `.vendor-name`
2. **Location:** Text content of `.vendor-location`
3. **Star Rating:** Float parsed from `.rating-value`
4. **Review Count:** Integer parsed from `.review-count`
5. **Starting Price:** Text content of `.starting-price`
6. **Profile URL:** href attribute of `.vendor-link`

### Pagination
- Next button: `button[aria-label="Next"]`
- Disabled state: `button[aria-label="Next"][disabled]`
- End of results: Next button missing or disabled

### Rate Limiting
- Minimum delay: 2 seconds
- Maximum delay: 4 seconds
- Jitter: ±500ms
- Wait for: networkidle state

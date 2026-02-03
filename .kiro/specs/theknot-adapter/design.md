# Design: TheKnot Site Adapter

## Architecture Overview

### Component Structure
```
TheKnot Adapter (implements SiteAdapter)
├── buildUrl() - Construct search URL
├── extractData() - Extract venue data from page
├── handlePagination() - Navigate to next page
├── getRateLimit() - Return delay between requests
└── validateParams() - Validate input parameters

Browser Controller
├── Launch Chromium (headless)
├── Navigate to URL
├── Wait for elements
├── Execute extraction
└── Close browser

Data Extractor
├── Query DOM with CSS selectors
├── Parse text content
├── Type coercion (string → number)
└── Handle missing fields
```

## Site Adapter Interface

### TypeScript Interface
```typescript
interface SiteAdapter {
  // Metadata
  name: string;
  displayName: string;
  description: string;
  
  // URL building
  buildUrl(params: Record<string, string>): string;
  
  // Data extraction
  extractData(page: Page): Promise<VenueData[]>;
  
  // Pagination
  handlePagination(page: Page): Promise<boolean>;
  
  // Rate limiting
  getRateLimit(): number;
  
  // Validation
  validateParams(params: Record<string, string>): ValidationResult;
}

interface VenueData {
  venueName: string;
  location: string;
  starRating: number;
  reviewCount: number;
  startingPrice: string;
  profileUrl: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

## TheKnot Adapter Implementation

### Class Structure
```typescript
export class TheKnotAdapter implements SiteAdapter {
  name = 'theknot';
  displayName = 'TheKnot.com';
  description = 'Wedding venues and vendors';
  
  buildUrl(params: { category: string, location: string }): string {
    const { category, location } = params;
    return `https://www.theknot.com/marketplace/${category}-${location}`;
  }
  
  async extractData(page: Page): Promise<VenueData[]> {
    // Wait for vendor cards to load
    await page.waitForSelector('.vendor-card', { timeout: 10000 });
    
    // Extract data from all cards on current page
    return page.$$eval('.vendor-card', cards => 
      cards.map(card => ({
        venueName: card.querySelector('.vendor-name')?.textContent?.trim() || '',
        location: card.querySelector('.vendor-location')?.textContent?.trim() || '',
        starRating: parseFloat(card.querySelector('.rating-value')?.textContent || '0'),
        reviewCount: parseInt(
          card.querySelector('.review-count')?.textContent?.replace(/\D/g, '') || '0'
        ),
        startingPrice: card.querySelector('.starting-price')?.textContent?.trim() || '',
        profileUrl: card.querySelector('a.vendor-link')?.getAttribute('href') || ''
      }))
    );
  }
  
  async handlePagination(page: Page): Promise<boolean> {
    // Find next button
    const nextButton = await page.$('button[aria-label="Next"]');
    
    // Check if button exists and is enabled
    if (!nextButton) return false;
    const isDisabled = await nextButton.isDisabled();
    if (isDisabled) return false;
    
    // Click and wait for navigation
    await nextButton.click();
    await page.waitForLoadState('networkidle');
    
    // Respectful delay (2-4 seconds with jitter)
    const delay = 2000 + Math.random() * 2000;
    await page.waitForTimeout(delay);
    
    return true;
  }
  
  getRateLimit(): number {
    return 2000; // 2 seconds minimum between requests
  }
  
  validateParams(params: Record<string, string>): ValidationResult {
    const { category, location } = params;
    
    if (!category) {
      return { valid: false, error: 'category is required' };
    }
    if (!location) {
      return { valid: false, error: 'location is required' };
    }
    
    // Validate format (lowercase with hyphens)
    if (!/^[a-z-]+$/.test(category)) {
      return { valid: false, error: 'category must be lowercase with hyphens' };
    }
    if (!/^[a-z-]+$/.test(location)) {
      return { valid: false, error: 'location must be lowercase with hyphens' };
    }
    
    return { valid: true };
  }
}
```

## Browser Controller

### Playwright Configuration
```typescript
const browserConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu'
  ]
};

async function launchBrowser(): Promise<Browser> {
  return await playwright.chromium.launch(browserConfig);
}
```

### Page Navigation
```typescript
async function navigateToPage(page: Page, url: string): Promise<void> {
  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000
  });
}
```

### Error Handling
```typescript
async function captureScreenshot(page: Page, jobId: string): Promise<string> {
  const screenshotPath = `./data/screenshots/${jobId}_error.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}
```

## Data Extraction

### CSS Selectors
```typescript
const SELECTORS = {
  vendorCard: '.vendor-card',
  venueName: '.vendor-name',
  location: '.vendor-location',
  rating: '.rating-value',
  reviewCount: '.review-count',
  price: '.starting-price',
  link: 'a.vendor-link',
  nextButton: 'button[aria-label="Next"]'
};
```

### Type Coercion
```typescript
function parseRating(text: string | null): number {
  if (!text) return 0;
  const rating = parseFloat(text);
  return isNaN(rating) ? 0 : rating;
}

function parseReviewCount(text: string | null): number {
  if (!text) return 0;
  const digits = text.replace(/\D/g, '');
  const count = parseInt(digits);
  return isNaN(count) ? 0 : count;
}
```

### Missing Field Handling
```typescript
function extractField(element: Element | null, selector: string): string {
  const field = element?.querySelector(selector);
  return field?.textContent?.trim() || '';
}
```

## Pagination Logic

### Flow Diagram
```
1. Extract data from current page
2. Look for Next button
3. If button not found → End pagination (return false)
4. If button disabled → End pagination (return false)
5. Click Next button
6. Wait for network idle
7. Add respectful delay (2-4 seconds)
8. Return true (continue pagination)
```

### Implementation
```typescript
async function handlePagination(page: Page, maxPages: number, currentPage: number): Promise<boolean> {
  // Check if we've reached max pages
  if (currentPage >= maxPages) {
    return false;
  }
  
  // Find next button
  const nextButton = await page.$('button[aria-label="Next"]');
  if (!nextButton) {
    console.log('No next button found - end of results');
    return false;
  }
  
  // Check if button is disabled
  const isDisabled = await nextButton.isDisabled();
  if (isDisabled) {
    console.log('Next button disabled - end of results');
    return false;
  }
  
  // Click and wait
  await nextButton.click();
  await page.waitForLoadState('networkidle');
  
  // Respectful delay with jitter
  const baseDelay = 2000;
  const jitter = Math.random() * 2000;
  const totalDelay = baseDelay + jitter;
  
  console.log(`Waiting ${totalDelay}ms before next page...`);
  await page.waitForTimeout(totalDelay);
  
  return true;
}
```

## Rate Limiting

### Strategy
- **Base delay:** 2 seconds (2000ms)
- **Jitter:** ±1 second (±1000ms)
- **Total range:** 2-4 seconds
- **Purpose:** Appear more human, avoid rate limiting

### Implementation
```typescript
function calculateDelay(): number {
  const baseDelay = 2000; // 2 seconds
  const jitter = Math.random() * 2000; // 0-2 seconds
  return baseDelay + jitter; // 2-4 seconds total
}

async function respectfulDelay(): Promise<void> {
  const delay = calculateDelay();
  await new Promise(resolve => setTimeout(resolve, delay));
}
```

## Adapter Registry

### Registration
```typescript
class AdapterRegistry {
  private adapters = new Map<string, SiteAdapter>();
  
  register(adapter: SiteAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }
  
  get(name: string): SiteAdapter | undefined {
    return this.adapters.get(name);
  }
  
  list(): SiteAdapter[] {
    return Array.from(this.adapters.values());
  }
}

// Global registry
export const registry = new AdapterRegistry();
registry.register(new TheKnotAdapter());
```

### Usage in Job Worker
```typescript
async function executeJob(job: Job): Promise<void> {
  // Get adapter
  const adapter = registry.get(job.site);
  if (!adapter) {
    throw new Error(`Unknown site: ${job.site}`);
  }
  
  // Validate parameters
  const validation = adapter.validateParams(job.parameters);
  if (!validation.valid) {
    throw new Error(`Invalid parameters: ${validation.error}`);
  }
  
  // Build URL
  const url = adapter.buildUrl(job.parameters);
  
  // Launch browser
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to first page
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const allData: VenueData[] = [];
    let currentPage = 1;
    const maxPages = job.parameters.maxPages || 10;
    
    // Scrape pages
    while (currentPage <= maxPages) {
      // Extract data from current page
      const pageData = await adapter.extractData(page);
      allData.push(...pageData);
      
      // Update progress
      await updateJobProgress(job.id, currentPage, maxPages, allData.length);
      
      // Try to go to next page
      const hasNextPage = await adapter.handlePagination(page);
      if (!hasNextPage) break;
      
      currentPage++;
      
      // Respect rate limit
      await sleep(adapter.getRateLimit());
    }
    
    // Export data
    await exportData(job, allData);
    
  } finally {
    await browser.close();
  }
}
```

## Correctness Properties

### Property 2.1: URL Format
**Validates:** Requirements 2.1, 2.2, 2.3  
**Property:** buildUrl() always returns valid TheKnot marketplace URL  
**Test Strategy:** Generate random category/location pairs, verify URL format matches pattern

### Property 2.2: Data Extraction Completeness
**Validates:** Requirements 1.1-1.6  
**Property:** extractData() returns array with all 6 fields for each venue  
**Test Strategy:** Mock HTML with various venue cards, verify all fields present

### Property 2.3: Pagination Termination
**Validates:** Requirements 3.1-3.6  
**Property:** Pagination always terminates (no infinite loops)  
**Test Strategy:** Mock pages with/without Next button, verify termination

### Property 2.4: Rate Limit Compliance
**Validates:** Requirements 4.1-4.5  
**Property:** Delay between requests is always ≥ 2 seconds  
**Test Strategy:** Measure actual delays, verify all ≥ 2000ms

### Property 2.5: Missing Field Handling
**Validates:** Requirements 1.7  
**Property:** Missing fields return empty string or 0, never throw errors  
**Test Strategy:** Mock HTML with missing fields, verify graceful handling

## Testing Strategy

### Unit Tests
- URL building with various parameters
- Parameter validation (valid/invalid formats)
- Data extraction from mock HTML
- Type coercion (string → number)
- Missing field handling

### Integration Tests
- Full scraping flow (navigate → extract → paginate)
- Browser launch and close
- Screenshot capture on errors
- Rate limiting delays

### Property-Based Tests
- URL format (Property 2.1)
- Data extraction completeness (Property 2.2)
- Pagination termination (Property 2.3)
- Rate limit compliance (Property 2.4)
- Missing field handling (Property 2.5)

### Manual Tests
- Real TheKnot scraping (5 pages)
- Verify CSV output matches BrowserAct format
- Check for blocking or CAPTCHA
- Validate all 6 fields extracted correctly

## Performance Considerations

### Optimization Strategies
1. **Headless mode:** Faster than headed browser
2. **Single browser instance:** Reuse context for multiple pages
3. **Efficient selectors:** Use specific CSS selectors
4. **Lazy screenshot:** Only capture on errors

### Resource Limits
- Memory: <300MB per browser instance
- CPU: <50% per scraping job
- Network: Minimal (public pages, no heavy assets)

## Error Handling

### Common Errors
1. **Element not found:** Wait longer, retry, or skip
2. **Navigation timeout:** Retry with longer timeout
3. **Next button missing:** End pagination gracefully
4. **Network error:** Retry with exponential backoff

### Error Recovery
```typescript
async function extractDataWithRetry(page: Page, retries = 3): Promise<VenueData[]> {
  for (let i = 0; i < retries; i++) {
    try {
      return await extractData(page);
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000 * (i + 1)); // Exponential backoff
    }
  }
  throw new Error('Failed after retries');
}
```

## Future Enhancements

### Phase 2
- Detail enrichment (website, phone, email, social media)
- Two-pass scraping (listings → details)
- Batch processing with rate limiting

### Phase 3
- Additional site adapters (Yelp, Google Maps)
- Proxy support (for sites that need it)
- CAPTCHA solving (for sites that need it)

## References
- Requirements: .kiro/specs/theknot-adapter/requirements.md
- Playwright Docs: https://playwright.dev/
- TheKnot Research: scraper-automation-tool/docs/project-context.md
- PRD: scraper-automation-tool/docs/PRD.md

# Tasks: TheKnot Site Adapter

## Epic 2: TheKnot Site Adapter

### 1. Site Adapter Interface
- [ ] 1.1 Define SiteAdapter TypeScript interface
- [ ] 1.2 Define VenueData TypeScript interface
- [ ] 1.3 Define ValidationResult TypeScript interface
- [ ] 1.4 Create adapter registry class
- [ ] 1.5 Write unit tests for adapter registry

### 2. TheKnot Adapter - URL Building
- [ ] 2.1 Implement TheKnotAdapter class skeleton
- [ ] 2.2 Implement buildUrl() method
- [ ] 2.3 Implement validateParams() method
- [ ] 2.4 Add parameter format validation (lowercase-with-hyphens)
- [ ] 2.5 Write unit tests for URL building
- [ ] 2.6 **PBT:** Property test for URL format (Property 2.1)

### 3. Browser Controller Setup
- [ ] 3.1 Install Playwright and Chromium
- [ ] 3.2 Create browser launch configuration
- [ ] 3.3 Implement browser launch function
- [ ] 3.4 Implement page navigation function
- [ ] 3.5 Add error handling for browser operations
- [ ] 3.6 Write unit tests for browser controller

### 4. Data Extraction
- [ ] 4.1 Define CSS selectors for TheKnot elements
- [ ] 4.2 Implement extractData() method
- [ ] 4.3 Add type coercion (string → number for rating/reviews)
- [ ] 4.4 Implement missing field handling (return empty/0)
- [ ] 4.5 Add wait for vendor cards to load
- [ ] 4.6 Write unit tests with mock HTML
- [ ] 4.7 **PBT:** Property test for data completeness (Property 2.2)
- [ ] 4.8 **PBT:** Property test for missing field handling (Property 2.5)

### 5. Pagination Handler
- [ ] 5.1 Implement handlePagination() method
- [ ] 5.2 Add Next button detection (aria-label="Next")
- [ ] 5.3 Check if button is disabled
- [ ] 5.4 Implement button click and wait for load
- [ ] 5.5 Add pagination termination logic
- [ ] 5.6 Write unit tests for pagination
- [ ] 5.7 **PBT:** Property test for pagination termination (Property 2.3)

### 6. Rate Limiting
- [ ] 6.1 Implement getRateLimit() method (return 2000ms)
- [ ] 6.2 Add delay calculation with jitter (2-4 seconds)
- [ ] 6.3 Implement respectful delay function
- [ ] 6.4 Add wait for network idle after navigation
- [ ] 6.5 Write unit tests for rate limiting
- [ ] 6.6 **PBT:** Property test for rate limit compliance (Property 2.4)

### 7. Adapter Registration
- [ ] 7.1 Create global adapter registry instance
- [ ] 7.2 Register TheKnotAdapter in registry
- [ ] 7.3 Export registry for use in job worker
- [ ] 7.4 Add adapter listing function
- [ ] 7.5 Write unit tests for registration

### 8. Job Worker Integration
- [ ] 8.1 Update job worker to use adapter registry
- [ ] 8.2 Add adapter lookup by site name
- [ ] 8.3 Implement parameter validation before scraping
- [ ] 8.4 Add URL building from parameters
- [ ] 8.5 Integrate extractData() in scraping loop
- [ ] 8.6 Integrate handlePagination() in scraping loop
- [ ] 8.7 Add rate limiting between pages
- [ ] 8.8 Write integration tests for job worker

### 9. Error Handling
- [ ] 9.1 Add screenshot capture on errors
- [ ] 9.2 Implement retry logic for element not found
- [ ] 9.3 Add timeout handling for navigation
- [ ] 9.4 Implement graceful pagination termination
- [ ] 9.5 Add error logging with context
- [ ] 9.6 Write unit tests for error scenarios

### 10. Integration Testing
- [ ] 10.1 Write end-to-end test (submit job → scrape → results)
- [ ] 10.2 Test with real TheKnot pages (5 pages)
- [ ] 10.3 Verify all 6 fields extracted correctly
- [ ] 10.4 Test pagination (multiple pages)
- [ ] 10.5 Test rate limiting (measure delays)
- [ ] 10.6 Test missing field handling
- [ ] 10.7 Test error scenarios (element not found, timeout)

### 11. Manual Testing
- [ ] 11.1 Scrape TheKnot Los Angeles venues (5 pages)
- [ ] 11.2 Verify CSV output matches BrowserAct format
- [ ] 11.3 Check for blocking or CAPTCHA
- [ ] 11.4 Validate data quality (no empty fields)
- [ ] 11.5 Test different categories and locations
- [ ] 11.6 Monitor for rate limiting or errors

### 12. Documentation
- [ ] 12.1 Document TheKnot adapter usage
- [ ] 12.2 Add code comments for complex logic
- [ ] 12.3 Document CSS selectors and HTML structure
- [ ] 12.4 Create troubleshooting guide
- [ ] 12.5 Add examples for different categories/locations

## Property-Based Test Tasks

### PBT-1: URL Format (Property 2.1)
- [ ] PBT-1.1 Write property test using fast-check
- [ ] PBT-1.2 Generate random category/location pairs
- [ ] PBT-1.3 Verify URL matches pattern: `https://www.theknot.com/marketplace/{category}-{location}`
- [ ] PBT-1.4 Test with 100+ random inputs

### PBT-2: Data Extraction Completeness (Property 2.2)
- [ ] PBT-2.1 Write property test for data completeness
- [ ] PBT-2.2 Generate mock HTML with random venue data
- [ ] PBT-2.3 Verify all 6 fields present in extracted data
- [ ] PBT-2.4 Test with various HTML structures

### PBT-3: Pagination Termination (Property 2.3)
- [ ] PBT-3.1 Write property test for pagination termination
- [ ] PBT-3.2 Mock pages with/without Next button
- [ ] PBT-3.3 Verify pagination always terminates (no infinite loops)
- [ ] PBT-3.4 Test with maxPages limits

### PBT-4: Rate Limit Compliance (Property 2.4)
- [ ] PBT-4.1 Write property test for rate limiting
- [ ] PBT-4.2 Measure actual delays between requests
- [ ] PBT-4.3 Verify all delays ≥ 2000ms
- [ ] PBT-4.4 Test with 50+ page navigations

### PBT-5: Missing Field Handling (Property 2.5)
- [ ] PBT-5.1 Write property test for missing fields
- [ ] PBT-5.2 Generate mock HTML with randomly missing fields
- [ ] PBT-5.3 Verify no errors thrown
- [ ] PBT-5.4 Verify empty string or 0 returned for missing fields

## Task Dependencies

```
1 (Interface) → 2 (URL Building) → 7 (Registration)
1 → 3 (Browser Setup) → 4 (Data Extraction)
4 → 5 (Pagination) → 6 (Rate Limiting)
7 → 8 (Job Worker Integration)
8 → 9 (Error Handling)
9 → 10 (Integration Testing)
10 → 11 (Manual Testing)
11 → 12 (Documentation)
```

## Estimated Effort

| Task Group | Stories | Estimated Hours |
|------------|---------|-----------------|
| Site Adapter Interface | 1 | 2-3 hours |
| URL Building | 2 | 2-3 hours |
| Browser Controller | 3 | 3-4 hours |
| Data Extraction | 4 | 4-6 hours |
| Pagination Handler | 5 | 3-4 hours |
| Rate Limiting | 6 | 2-3 hours |
| Adapter Registration | 7 | 1-2 hours |
| Job Worker Integration | 8 | 4-6 hours |
| Error Handling | 9 | 3-4 hours |
| Integration Testing | 10 | 4-6 hours |
| Manual Testing | 11 | 2-3 hours |
| Documentation | 12 | 2-3 hours |
| **Total** | **12 groups** | **32-47 hours** |

## Sprint Planning

### Sprint 1 (Week 1)
- Tasks 1-3: Interface, URL building, browser setup
- **Goal:** Basic adapter structure with browser automation

### Sprint 2 (Week 2)
- Tasks 4-6: Data extraction, pagination, rate limiting
- **Goal:** Complete scraping logic

### Sprint 3 (Week 3)
- Tasks 7-9: Registration, integration, error handling
- **Goal:** Integrated with job worker

### Sprint 4 (Week 4)
- Tasks 10-12: Testing, manual validation, documentation
- **Goal:** Production-ready adapter

## Definition of Done

### Task Completion Criteria
- [ ] Code written and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (if applicable)
- [ ] Property-based tests written and passing (if applicable)
- [ ] Code documented (comments + README)
- [ ] No linting errors
- [ ] Performance targets met (<10 seconds per page)
- [ ] Manually tested with real TheKnot pages

### Epic Completion Criteria
- [ ] All tasks completed
- [ ] All tests passing (100% pass rate)
- [ ] Adapter registered and working
- [ ] Scrapes all 6 fields correctly
- [ ] Pagination works reliably
- [ ] Rate limiting implemented (2-4 seconds)
- [ ] 90%+ success rate on test runs
- [ ] No blocking or CAPTCHA observed
- [ ] CSV output matches BrowserAct format
- [ ] Documentation complete

## Notes

### Testing Framework
- **Unit/Integration:** Vitest
- **Property-Based:** fast-check
- **Browser Testing:** Playwright Test
- **Coverage:** >80% target

### Development Environment
- Node.js 20 LTS
- TypeScript 5.x (strict mode)
- Playwright with Chromium
- Windows PC (localhost)

### TheKnot Specifics
- URL Pattern: `https://www.theknot.com/marketplace/{category}-{location}`
- Selectors: `.vendor-card`, `.vendor-name`, `.rating-value`, etc.
- Pagination: `button[aria-label="Next"]`
- Rate Limit: 2-4 seconds between pages
- No proxies or CAPTCHA needed

### Cost Target
- $0/month (no proxies, no CAPTCHA, no residential IPs)
- Runs on existing Windows PC
- Public data only (no authentication)

### Success Metrics
- 90%+ success rate on TheKnot scraping
- <10 seconds per page
- All 6 fields extracted correctly
- Pagination works reliably
- No blocking observed

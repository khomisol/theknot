# Product Requirements Document (PRD)
# Web Scraping Automation Platform

## Document Info
- **Project:** Web Scraping Automation Platform
- **Author:** PM (John)
- **Date:** January 25, 2026
- **Status:** Draft
- **Version:** 1.0

---

## 1. Executive Summary

### Vision
Build a **zero-cost, API-first web scraping service** that runs on your existing computer, eliminating the $500-1,000/month costs of SaaS tools like BrowserAct while providing full control and data ownership.

### Goals
1. **Primary:** Create a REST API for scraping TheKnot.com wedding venues with zero recurring costs
2. **Secondary:** Enable n8n/Zapier/CRM integration for automated data collection
3. **Tertiary:** Provide extensible site adapter pattern for adding new sites (Yelp, etc.)

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly recurring cost | $0 | Infrastructure costs |
| Setup time | <5 min | Time from install to first scrape |
| Success rate | >90% | Successful scrapes / total scrapes |
| Cost savings vs BrowserAct | 100% | $0 vs $500-1,000/month |
| Integration time (n8n) | <1 hour | Time to working n8n workflow |

---

## 2. Problem Statement

### The Problem
BrowserAct and similar SaaS scraping tools force an impossible trade-off:
- **High costs:** $0.05-0.10 per page = $500-1,000/month for 10K pages
- **Vendor lock-in:** Credit-based pricing, can't switch easily
- **No data ownership:** Data stored on vendor servers
- **Limited control:** Can't customize beyond what UI allows

### Who Has This Problem
**Primary:** Solo entrepreneurs and small businesses
- Need to scrape TheKnot.com for wedding venue data
- Building CRM or lead generation systems
- Budget-conscious (can't afford $500+/month)
- Want data ownership and control
- Have existing Windows PC

**Secondary:** Developers building automation workflows
- Using n8n, Zapier, or similar tools
- Need reliable data sources
- Want to integrate scraping into workflows
- Prefer API-first solutions

### Current Solutions
1. **BrowserAct/Apify:** $500-1,000/month for 10K pages, easy but expensive
2. **Raw Playwright:** Free but requires 40+ hours to build framework
3. **Outsourcing:** $500-2,000 one-time, but not maintainable
4. **Manual scraping:** Free but time-consuming and not scalable

### Why Now
- You're facing $500+/month BrowserAct costs for TheKnot project
- You've learned the patterns from building workflows in BrowserAct
- Modern tools (Playwright, Node.js) make this achievable
- Running on existing PC = zero recurring costs

---

## 3. User Personas

### Primary Persona: Budget-Conscious Entrepreneur Sam
- **Role:** Small business owner building wedding vendor CRM
- **Goals:** 
  - Scrape TheKnot.com for wedding venue leads
  - Build automated lead generation system
  - Integrate with n8n or CRM
  - Keep costs at $0/month
- **Pain Points:** 
  - BrowserAct costs $500+/month (unsustainable)
  - Manual scraping takes too much time
  - Needs reliable, automated solution
  - Limited technical skills (prefers API over code)
- **Tech Savviness:** Medium (can use n8n, understand APIs)
- **Budget:** $0/month for scraping (will pay for CRM/n8n separately)
- **Success Criteria:** Automated daily scraping of new venues, zero scraping costs

### Secondary Persona: Automation Developer Alex
- **Role:** Developer building n8n/Zapier workflows for clients
- **Goals:**
  - Integrate scraping into automation workflows
  - Reliable API for data collection
  - Self-hosted for data ownership
  - Easy to deploy and maintain
- **Pain Points:**
  - SaaS tools are expensive for clients
  - Need API-first solutions (not CLI)
  - Want to run on client infrastructure
  - Need webhook support for real-time updates
- **Tech Savviness:** High (comfortable with Node.js, APIs, Docker)
- **Budget:** $0-50/month per client
- **Success Criteria:** Reliable API, easy integration, low maintenance

---

## 4. Functional Requirements (FRs)

### FR-1: REST API for Job Submission
**Description:** REST API endpoint to submit scraping jobs asynchronously
**User Story:** As an n8n user, I want to submit scraping jobs via HTTP POST so that I can integrate scraping into my automation workflows
**Acceptance Criteria:**
- [ ] POST /api/scrape endpoint accepts site, category, location, maxPages
- [ ] Returns jobId immediately (non-blocking)
- [ ] Validates parameters before queuing
- [ ] Returns 202 Accepted with job details
- [ ] API key authentication (Bearer token)
**Priority:** Must Have

### FR-2: Job Status Tracking
**Description:** API endpoint to check job status and progress
**User Story:** As an n8n user, I want to poll job status so that I know when scraping is complete
**Acceptance Criteria:**
- [ ] GET /api/jobs/:id returns current status
- [ ] Status includes: queued, running, completed, failed
- [ ] Running status shows progress (current page, items extracted)
- [ ] Completed status includes result summary
- [ ] Failed status includes error message
**Priority:** Must Have

### FR-3: TheKnot Site Adapter
**Description:** Scraping adapter specifically for TheKnot.com wedding venues
**User Story:** As a wedding vendor CRM owner, I want to scrape TheKnot venues so that I can build my lead database
**Acceptance Criteria:**
- [ ] Scrapes 6 data fields: name, location, rating, reviews, price, URL
- [ ] Handles pagination (Next button)
- [ ] Respects 2-4 second delays between pages
- [ ] Exports CSV matching BrowserAct format
- [ ] Handles missing fields gracefully
**Priority:** Must Have

### FR-4: Browser Automation Engine
**Description:** Execute scraping using Playwright with Chromium
**User Story:** As a system, I want reliable browser automation so that scraping works consistently
**Acceptance Criteria:**
- [ ] Launch Chromium in headless mode
- [ ] Handle dynamic content loading (wait for elements)
- [ ] Manage browser contexts and sessions
- [ ] Handle popups and dialogs automatically
- [ ] Capture screenshots on errors
**Priority:** Must Have

### FR-5: Data Extraction Framework
**Description:** Extract structured data from pages using CSS selectors
**User Story:** As a system, I want flexible data extraction so that I can get the exact data needed
**Acceptance Criteria:**
- [ ] Support CSS selectors for element targeting
- [ ] Extract text, attributes, HTML content
- [ ] Handle missing elements gracefully (return null)
- [ ] Support list extraction (multiple items per page)
- [ ] Type coercion (string → number for ratings)
**Priority:** Must Have

### FR-6: Pagination Handler
**Description:** Automatically handle multi-page navigation
**User Story:** As a user, I want automatic pagination so that I can scrape entire datasets without manual intervention
**Acceptance Criteria:**
- [ ] Support "Next" button clicking
- [ ] Configurable max pages limit
- [ ] Detect end of pagination automatically
- [ ] Wait for page load after navigation
- [ ] Respect rate limits between pages
**Priority:** Must Have

### FR-7: Error Handling & Retries
**Description:** Robust error handling with automatic retries
**User Story:** As a user, I want automatic error recovery so that my jobs don't fail due to temporary issues
**Acceptance Criteria:**
- [ ] Retry failed requests (3 attempts)
- [ ] Exponential backoff between retries
- [ ] Handle network timeouts
- [ ] Handle element not found errors
- [ ] Log errors with context (screenshot, URL)
**Priority:** Must Have

### FR-8: Data Export System
**Description:** Export scraped data in CSV and JSON formats
**User Story:** As a user, I want flexible data export so that I can use scraped data in my applications
**Acceptance Criteria:**
- [ ] Export to CSV files (BrowserAct-compatible format)
- [ ] Export to JSON files
- [ ] Store files locally (./data/jobs/)
- [ ] Include metadata (job ID, timestamp, item count)
- [ ] Handle large datasets (streaming if needed)
**Priority:** Must Have

### FR-9: Job Queue System
**Description:** Manage async job execution with in-memory queue
**User Story:** As a system, I want job queuing so that multiple scrapes can be managed efficiently
**Acceptance Criteria:**
- [ ] In-memory queue (no Redis for MVP)
- [ ] FIFO processing
- [ ] Max 3 concurrent jobs
- [ ] Job persistence to database
- [ ] Job status updates
**Priority:** Must Have

### FR-10: SQLite Database
**Description:** Store job metadata and status in SQLite
**User Story:** As a system, I want persistent storage so that job history is maintained
**Acceptance Criteria:**
- [ ] Store job records (id, site, status, parameters)
- [ ] Store job logs (errors, progress)
- [ ] Store screenshots metadata
- [ ] Query jobs by status, site, date
- [ ] Database file: ./data/scraper.db
**Priority:** Must Have

### FR-11: Webhook Support
**Description:** POST results to webhook URL when job completes
**User Story:** As a CRM owner, I want webhook callbacks so that scraped data is automatically pushed to my system
**Acceptance Criteria:**
- [ ] Accept webhookUrl parameter in job submission
- [ ] POST job results to webhook when complete
- [ ] Include jobId, status, data in webhook payload
- [ ] Retry webhook delivery (3 attempts)
- [ ] Log webhook delivery status
**Priority:** Should Have

### FR-12: Rate Limiting
**Description:** Control request rate to avoid overwhelming target sites
**User Story:** As a responsible scraper, I want rate limiting so that I don't get blocked
**Acceptance Criteria:**
- [x] Configurable delay between requests (2-4 seconds for TheKnot)
- [x] Random jitter (±500ms) to appear more human
- [x] Respect robots.txt (check before scraping)
- [x] Per-site rate limit configuration
**Priority:** Should Have
**Status:** ✅ Complete

### FR-13: Detail Enrichment System
**Description:** Two-pass enrichment system to extract detailed venue information
**User Story:** As a CRM owner, I want to enrich venue listings with contact details so that I can reach out to potential partners
**Acceptance Criteria:**
- [x] POST /api/enrich endpoint accepts venue URLs
- [x] Extracts website, phone, email, social media links
- [x] Processes venues in batches with rate limiting
- [x] Handles individual failures gracefully (continues processing)
- [x] Returns enriched data merged with original listings
- [x] Cleans URLs (removes tracking parameters)
**Priority:** Should Have
**Status:** ✅ Complete (January 2026)

### FR-14: Two-Pass Scraping Approach
**Description:** Separate listing scraping from detail enrichment for efficiency
**User Story:** As a user, I want to scrape listings quickly and enrich selectively so that I can optimize costs and time
**Acceptance Criteria:**
- [x] Pass 1: Scrape listing pages for basic info + URLs (fast)
- [x] Pass 2: Enrich selected venues with detailed data (optional)
- [x] UI allows selecting which venues to enrich
- [x] Enrichment jobs tracked separately (job_type: 'enrich')
- [x] Can enrich from multiple scraping jobs
**Priority:** Should Have
**Status:** ✅ Complete (January 2026)

**Rationale for Two-Pass:**
- **Separation of Concerns:** Listing scraper stays fast and focused
- **Better Error Handling:** Individual failures don't lose entire dataset
- **Scalability:** Can prioritize which venues to enrich
- **Cost Efficiency:** Users only enrich venues they care about
- **Flexibility:** Can add more enrichment sources later (Google, Yelp)

---

## 5. Non-Functional Requirements (NFRs)

### Performance
- **API Response Time:** Job submission should return in <100ms
- **Job Start Time:** Scraping should start within 5 seconds of queuing
- **Throughput:** Support 3 concurrent jobs on 8GB RAM Windows PC
- **Resource Usage:** <500MB RAM per job
- **Page Scraping:** <10 seconds per page (TheKnot)

### Cost
- **Infrastructure:** $0/month (run on existing Windows PC)
- **Software:** $0/month (all open source dependencies)
- **Services:** $0/month (no proxies, CAPTCHA, or cloud services)
- **Electricity:** ~$1-2/month (when PC is running)

### Security
- **Authentication:** API key-based authentication (Bearer token)
- **Data Protection:** All data stored locally (no cloud)
- **Isolation:** Each job runs in isolated browser context
- **Secrets Management:** API keys in environment variables

### Reliability
- **Success Rate:** 90%+ success rate on TheKnot scraping
- **Recovery:** Automatic restart on crash (if using systemd/Docker)
- **Backup:** Manual backup of ./data/ folder
- **Logging:** Comprehensive logging for debugging

### Usability
- **Setup Time:** <5 minutes from install to first scrape
- **API Documentation:** Complete OpenAPI/Swagger docs
- **Error Messages:** Clear, actionable error messages
- **n8n Integration:** <1 hour to working n8n workflow

### Maintainability
- **Code Quality:** TypeScript with strict mode
- **Testing:** 80%+ test coverage (future)
- **Modularity:** Site adapter pattern for extensibility
- **Documentation:** Complete API docs and integration guides

---

## 6. User Flows

### Flow 1: Create and Run First Workflow
```
Install CLI → Create workflow file → Define scraping logic → 
Run workflow → View results → Export data
```

### Flow 2: Schedule Recurring Workflow
```
Create workflow → Test manually → Define schedule (cron) → 
Enable scheduling → Monitor executions → Review data
```

### Flow 3: Debug Failed Workflow
```
Workflow fails → View error logs → Check screenshot → 
Identify issue → Update workflow → Re-run → Success
```

### Flow 4: Scale to Multiple Sites
```
Create base template → Clone for site A → Customize selectors → 
Clone for site B → Customize selectors → Run all workflows → 
Merge data
```

---

## 7. Out of Scope

### Explicitly NOT Included (v1.0)
- Visual workflow builder (API-first approach only)
- AI-powered element detection (use explicit CSS selectors)
- CAPTCHA solving (not needed for TheKnot)
- Proxy rotation (not needed for TheKnot)
- Stealth/anti-detection (not needed for TheKnot)
- Multi-user authentication (single-user deployment)
- Real-time streaming (async job pattern)
- CLI tool (API-first, CLI is optional)
- Scheduling system (use n8n/cron for scheduling)
- Multiple site adapters (TheKnot only for MVP)

### Future Considerations (v2.0+)
- Additional site adapters (Yelp, Google Maps, etc.)
- Proxy support (for sites that need it)
- Web dashboard for monitoring
- PostgreSQL support (for multi-instance)
- BullMQ + Redis (for distributed queue)
- Advanced analytics and insights
- Workflow marketplace/sharing

---

## 8. Dependencies

### External Dependencies
- **Playwright/Puppeteer:** Browser automation engine
- **Node.js:** Runtime environment (v18+)
- **Docker:** Containerization (optional but recommended)
- **Database:** SQLite (bundled) or PostgreSQL (optional)

### Internal Dependencies
- None (greenfield project)

### Third-Party Services (Optional)
- **Proxy providers:** Bright Data, Oxylabs, ScraperAPI
- **Storage:** AWS S3, Google Cloud Storage for large datasets
- **Monitoring:** Sentry for error tracking

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Websites change structure frequently | High | High | Build flexible selectors, add change detection alerts |
| Getting blocked/rate limited | Medium | High | Implement proxy rotation, respect rate limits, add delays |
| Browser automation is resource-intensive | Medium | Medium | Optimize resource usage, support headless mode, add scaling docs |
| Complex sites require custom logic | High | Medium | Provide extensible plugin system, comprehensive examples |
| Maintenance burden grows over time | Medium | Medium | Excellent documentation, modular architecture, automated tests |
| Competition from established tools | Low | Low | Focus on cost and flexibility advantages, open source community |

---

## 10. Timeline

### Phase 1: MVP - Localhost (Weeks 1-4) - $0/month
| Milestone | Target | Description |
|-----------|--------|-------------|
| REST API | Week 1-2 | Fastify API + job queue + SQLite |
| TheKnot Adapter | Week 2-3 | Site adapter + pagination + export |
| Error Handling | Week 3-4 | Retries + screenshots + logging |
| Testing | Week 4 | Integration tests + documentation |

**Deliverable:** Working API on localhost that scrapes TheKnot

### Phase 2: Integration (Weeks 5-6) - $0/month
| Milestone | Target | Description |
|-----------|--------|-------------|
| n8n Integration | Week 5 | Example workflows + documentation |
| Webhook Support | Week 5-6 | CRM callbacks + retry logic |
| API Documentation | Week 6 | OpenAPI/Swagger docs |

**Deliverable:** n8n can trigger scrapes and receive results

### Phase 3: Production (Weeks 7-8) - $0/month
| Milestone | Target | Description |
|-----------|--------|-------------|
| Rate Limiting | Week 7 | Per-API-key limits |
| Monitoring | Week 7-8 | Health checks + metrics |
| Documentation | Week 8 | Complete guides + examples |

**Deliverable:** Production-ready for daily use

### Phase 4: Scale (Optional) - $5-10/month
| Milestone | Target | Description |
|-----------|--------|-------------|
| VPS Deployment | Week 9 | Docker + deployment guide |
| Additional Sites | Week 10-11 | Yelp adapter + others |
| Web Dashboard | Week 12 | Basic monitoring UI |

**Only if you need 24/7 availability or additional sites**

---

## 11. Technical Approach

### Architecture Overview
```
Your Windows PC (localhost)
├── REST API (Fastify) - Port 3000
│   └── POST /api/scrape, GET /api/jobs/:id
├── Job Queue (In-Memory)
│   └── FIFO processing, max 3 concurrent
├── Job Worker
│   └── Processes jobs from queue
├── Site Adapter (TheKnot)
│   └── Site-specific scraping logic
├── Browser Controller (Playwright)
│   └── Chromium headless
├── Data Extractor
│   └── CSS selectors + type coercion
├── Export System
│   └── CSV/JSON files
└── SQLite Database
    └── Job metadata + logs

All running locally = $0/month
```

### Technology Stack
- **Language:** TypeScript + Node.js 20 LTS
- **Browser:** Playwright (Chromium only)
- **Database:** SQLite (built-in)
- **API:** Fastify (high performance)
- **Queue:** In-memory (no Redis)
- **Testing:** Jest or Vitest
- **Deployment:** Local (Windows PC)

### Site Adapter Pattern
```typescript
interface SiteAdapter {
  name: string;
  buildUrl(params: Record<string, string>): string;
  extractData(page: Page): Promise<any[]>;
  handlePagination(page: Page): Promise<boolean>;
  getRateLimit(): number;
}

class TheKnotAdapter implements SiteAdapter {
  name = 'theknot';
  
  buildUrl(params) {
    return `https://www.theknot.com/marketplace/${params.category}-${params.location}`;
  }
  
  async extractData(page) {
    // Extract 6 fields from .vendor-card elements
    return page.$$eval('.vendor-card', cards => ...);
  }
  
  async handlePagination(page) {
    // Click Next button, wait, return true/false
    const nextButton = await page.$('button[aria-label="Next"]');
    if (!nextButton) return false;
    await nextButton.click();
    await page.waitForTimeout(2000); // Respectful delay
    return true;
  }
  
  getRateLimit() {
    return 2000; // 2 seconds between pages
  }
}
```

### API Example
```bash
# Submit job
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "site": "theknot",
    "category": "wedding-reception-venues",
    "location": "los-angeles-ca",
    "maxPages": 5
  }'

# Response: {"jobId": "job_abc123", "status": "queued"}

# Check status
curl http://localhost:3000/api/jobs/job_abc123

# Download results
curl http://localhost:3000/api/jobs/job_abc123/download -o venues.csv
```

---

## 12. Competitive Analysis

### vs. BrowserAct
| Feature | BrowserAct | Our Tool |
|---------|------------|----------|
| Monthly Cost | $500-1,000 | $0 |
| Per-Page Cost | $0.05-0.10 | $0 |
| Setup Time | 5 min | 5 min |
| Ease of Use | High (visual) | Medium (API) |
| Flexibility | Medium | High |
| Data Ownership | Vendor | Full |
| Customization | Limited | Unlimited |
| Integration | API | Native (n8n/Zapier) |

### vs. Raw Playwright
| Feature | Raw Playwright | Our Tool |
|---------|----------------|----------|
| Setup Time | 40+ hours | 5 minutes |
| Cost | $0 | $0 |
| Error Handling | Manual | Built-in |
| Pagination | Manual | Automatic |
| API | None | Included |
| Job Queue | Manual | Included |
| Learning Curve | Steep | Moderate |

### vs. Apify
| Feature | Apify | Our Tool |
|---------|-------|----------|
| Monthly Cost | $400-800 | $0 |
| Data Ownership | Vendor | Full |
| Customization | Medium | High |
| Self-Hosted | No | Yes |

**Key Differentiator:** Zero recurring costs while maintaining full control and flexibility

---

## Appendix

### Glossary
- **Workflow:** A defined sequence of scraping actions
- **Selector:** CSS or XPath expression to target elements
- **Extraction:** Process of pulling data from HTML
- **Pagination:** Navigating through multiple pages
- **Headless:** Browser running without visible UI

### References
- BrowserAct pricing: https://www.browseract.com/pricing
- Playwright docs: https://playwright.dev/
- TheKnot scraper project: ../theknot-scraper/

### Inspiration
This PRD is based on real pain points discovered while building the TheKnot scraper with BrowserAct, where costs would exceed $500/month for comprehensive data collection. The solution: build our own tool that runs on existing hardware for $0/month.

**Key Insight:** TheKnot.com doesn't need proxies, CAPTCHA solving, or stealth techniques. It's public business data meant to be discovered. This makes a zero-cost solution viable.

---

## Summary

**What We're Building:**
A zero-cost, API-first web scraping service that runs on your existing Windows PC, specifically designed to scrape TheKnot.com wedding venues and integrate with n8n/Zapier/CRM systems.

**Why It Matters:**
- **Cost Savings:** $6,000-12,000/year vs BrowserAct
- **Data Ownership:** All data stays on your computer
- **Full Control:** Customize anything, no vendor lock-in
- **Integration Ready:** Built for n8n/Zapier/CRM from day one

**Success Criteria:**
- Setup in <5 minutes
- Scrape TheKnot for $0/month
- 90%+ success rate
- n8n integration in <1 hour

---

**Next Steps:**
1. ✅ Review and approve PRD
2. ✅ Create Architecture document (Architect agent) - COMPLETE
3. ⏳ Update Epics with API-first approach (PM + SM agents)
4. ⏳ Begin Sprint 1 development (Developer agent)

**Questions for Stakeholder:**
1. ~~What's your preferred tech stack?~~ **ANSWERED:** TypeScript + Node.js + Playwright
2. ~~Priority: Speed to market vs Feature completeness?~~ **ANSWERED:** Speed (MVP in 4 weeks)
3. ~~Open source or proprietary?~~ **PENDING**
4. ~~Target deployment: Local, VPS, or Cloud?~~ **ANSWERED:** Local Windows PC ($0/month)

---

**Status:** ✅ PRD v2.0 Complete - Zero-Cost, API-First Approach  
**Last Updated:** January 25, 2026  
**Next Agent:** SM (Bob) for Epic updates

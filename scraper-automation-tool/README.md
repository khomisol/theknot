# Web Scraping Automation Platform

**Build Your Own Scraping Tool - Zero Recurring Costs**

Replace expensive SaaS tools like BrowserAct ($500-1,000/month) with a self-hosted solution that costs **$0/month** to run on your existing Windows PC.

**Status:** ✅ Sprint 1 Complete - Modern UI & API Ready!  
**Framework:** BMAD Universal  
**Created:** January 25, 2026  
**Last Updated:** January 26, 2026

---

## 💰 Cost Comparison

| Solution | Monthly Cost | Annual Cost | Your Savings |
|----------|--------------|-------------|--------------|
| **Your Tool (Local PC)** | **$0** | **$0** | **100%** |
| Your Tool (VPS 24/7) | $5-10 | $60-120 | 99% |
| BrowserAct | $500-1,000 | $6,000-12,000 | - |
| Apify | $400-800 | $4,800-9,600 | - |

**Save $6,000-12,000/year** by running on your existing computer!

---

## 🎯 Project Vision

Build a **zero-cost, API-first** web scraping service designed for integration with automation platforms (n8n, Zapier) and CRM systems.

**The Problem:** 
- BrowserAct costs $0.05-0.10 per page ($500+/month at scale)
- Vendor lock-in with credit-based pricing
- No data ownership

**The Solution:** 
- Self-hosted scraping API
- Run on your existing Windows PC = $0/month
- Full control and data ownership
- n8n/Zapier/CRM integration ready

---

## ✨ What You Get for $0/month

### Modern Web Interface
- ✅ **Tailwind CSS Dark Theme** - Beautiful, professional UI
- ✅ **Real-time Progress** - Circular indicators with live stats
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Accessible** - WCAG AA compliant, full keyboard navigation
- ✅ **Dashboard** - Job stats and recent activity
- ✅ **Database View** - Filter, search, paginate results
- ✅ **Enrichment** - Extract additional venue details
- ✅ **Cleanup Tools** - Duplicate detection and removal

### Core Features
- ✅ REST API for scraping
- ✅ TheKnot.com adapter (wedding venues)
- ✅ Pagination handling (Next button)
- ✅ CSV/JSON export (BrowserAct-compatible format)
- ✅ Job queue with status tracking
- ✅ Error handling with screenshots
- ✅ Retry logic (3 attempts)
- ✅ n8n/Zapier/CRM integration ready
- ✅ PostgreSQL database
- ✅ No proxies needed (TheKnot is public)
- ✅ No CAPTCHA solving needed
- ✅ No subscriptions, no credits, no limits

---

## 🚀 Quick Start (2 Minutes)

**Everything is already set up!** Just start the server:

```bash
cd scraper-automation-tool
npm run dev
```

### Option 1: Use the Web Interface (Easiest!)

1. Open your browser: **http://localhost:3000**
2. Fill in the form (defaults are pre-populated)
3. Click "🚀 Start Scraping"
4. Watch real-time progress updates
5. Download results when complete

**Features:**
- 🎨 Modern Tailwind CSS dark theme
- 📊 Real-time circular progress indicators
- 📈 Detailed progress stats (pages, venues, avg per page)
- 📥 One-click CSV/JSON downloads
- 📋 Job history and database view
- 🔍 Advanced filtering and search
- ✨ Venue enrichment workflow
- 🧹 Duplicate detection and cleanup
- ♿ Fully accessible (WCAG AA compliant)

### Option 2: Use the API

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d "{
    \"site\": \"theknot\",
    \"parameters\": {
      \"category\": \"wedding-reception-venues\",
      \"location\": \"los-angeles-ca\",
      \"maxPages\": 2
    },
    \"format\": \"csv\"
  }"
```

**See [TEST-GUIDE.md](./TEST-GUIDE.md) for complete testing guide!**

---

## 📚 Documentation

### Core Documents

1. **[TEST-GUIDE.md](./TEST-GUIDE.md)** - **START HERE!**
   - Web UI testing (easiest!)
   - cURL examples
   - Postman/Thunder Client
   - Troubleshooting

2. **[ZERO-COST-SETUP.md](./ZERO-COST-SETUP.md)** - Zero-Cost Guide
   - How to run for $0/month
   - Cost breakdown and savings
   - n8n integration guide

3. **[PRD.md](docs/PRD.md)** - Product Requirements Document
   - Vision and goals
   - User personas
   - Functional requirements (12 FRs)
   - Timeline and milestones

4. **[architecture.md](docs/architecture.md)** - System Architecture
   - API-first design
   - Site adapter pattern
   - Zero-cost deployment
   - Technology stack
   - 7 Architecture Decision Records

5. **[epics.md](docs/epics.md)** - Development Epics
   - 7 epics across 3 phases
   - Story estimates
   - Implementation timeline

6. **[project-context.md](docs/project-context.md)** - Project Context
   - Inspiration from TheKnot scraper
   - Key insights and lessons learned
   - Success criteria

7. **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Current Status
   - 60% complete (Sprint 1 done)
   - Next steps
   - Timeline tracking

8. **[SPRINT-1-COMPLETE.md](docs/sprint-artifacts/SPRINT-1-COMPLETE.md)** - Sprint 1 Summary
   - All 8 stories completed
   - 15 tests passing
   - System capabilities
   - What's next

9. **[SPRINT-2-PLAN.md](./SPRINT-2-PLAN.md)** - Sprint 2 Plan
   - 6 stories for real scraping
   - Story sequence and dependencies
   - Testing strategy
   - Success criteria

---

## 🚀 Quick Start (Future)

```bash
# Install
npm install -g scraper-tool

# Create workflow
scraper-tool init my-workflow

# Run workflow
scraper-tool run my-workflow.ts

# Schedule workflow
scraper-tool schedule my-workflow.ts --cron "0 8 * * *"
```

---

## 💡 Key Features

### API-First Design
- REST API as primary interface
- Async job queue (submit → poll → retrieve)
- Perfect for n8n/Zapier/CRM integration
- Webhook support for callbacks

### Zero-Cost Architecture
- Run on your existing Windows PC
- SQLite database (built-in)
- In-memory job queue (no Redis)
- No proxies or CAPTCHA services needed
- **Total: $0/month recurring costs**

### TheKnot Adapter (MVP)
- Wedding venue scraping
- 6 data fields extracted
- Pagination handling
- CSV/JSON export (BrowserAct-compatible)
- 2-4 second delays (respectful scraping)

### Extensible Design
- Site adapter pattern
- Easy to add new sites (Yelp, Google Maps, etc.)
- TypeScript interfaces
- Isolated, testable adapters

---

## 📊 Why This Beats BrowserAct

### Cost
| Feature | BrowserAct | Your Tool |
|---------|------------|-----------|
| Monthly Cost | $500-1,000 | $0 |
| Annual Cost | $6,000-12,000 | $0 |
| Per-Page Cost | $0.05-0.10 | $0 |
| Credit Limits | Yes | No |

### Control
| Feature | BrowserAct | Your Tool |
|---------|------------|-----------|
| Data Ownership | Vendor | You |
| Customization | Limited | Unlimited |
| Vendor Lock-in | Yes | No |
| API Access | Limited | Full |

### Integration
| Feature | BrowserAct | Your Tool |
|---------|------------|-----------|
| n8n | Via API | Native |
| Zapier | Via API | Native |
| CRM | Manual | Webhooks |
| Local Testing | No | Yes |

---

## 🏗️ Architecture

### Zero-Cost Deployment (Localhost)
```
Your Windows PC
├── API Server (localhost:3000)
│   └── REST API for job submission
├── Job Queue (in-memory)
│   └── Manages scraping jobs
├── Worker Process
│   └── Executes scraping
├── Playwright Browser
│   └── Scrapes TheKnot.com
├── SQLite Database
│   └── Stores job metadata
└── File Storage
    └── Saves CSV/JSON results

All running locally = $0/month
```

### Tech Stack (All Free & Open Source)
- **Language:** TypeScript + Node.js 20 LTS
- **Browser:** Playwright (Chromium)
- **Database:** SQLite (built-in)
- **API:** Fastify (high performance)
- **Queue:** In-memory (no Redis needed)
- **Storage:** Local filesystem

### Site Adapter Pattern
```typescript
interface SiteAdapter {
  buildUrl(params): string;
  extractData(page): Promise<Data[]>;
  handlePagination(page): Promise<boolean>;
  getRateLimit(): number;
}

// Easy to add new sites
class TheKnotAdapter implements SiteAdapter { ... }
class YelpAdapter implements SiteAdapter { ... }
```

---

## 📅 Timeline

### Phase 1: MVP - Localhost (Weeks 1-4) - $0/month
- ✅ Architecture complete
- ⏳ REST API (Fastify)
- ⏳ TheKnot adapter
- ⏳ Job queue (in-memory)
- ⏳ CSV/JSON export
- ⏳ Error handling

**Deliverable:** Scrape TheKnot via API on localhost

### Phase 2: n8n Integration (Weeks 5-6) - $0/month
- ⏳ n8n workflow examples
- ⏳ Webhook support
- ⏳ Enhanced logging
- ⏳ API documentation

**Deliverable:** n8n can trigger and retrieve scrapes

### Phase 3: CRM Integration (Weeks 7-8) - $0/month
- ⏳ CRM webhook callbacks
- ⏳ Rate limiting
- ⏳ Monitoring
- ⏳ Production docs

**Deliverable:** End-to-end automation

### Phase 4: Scale (Optional) - $5-10/month
- ⏳ VPS deployment
- ⏳ Additional site adapters
- ⏳ Web dashboard

**Only if you need 24/7 availability**

---

## 🎓 Inspiration

This project is inspired by real pain points discovered while building the [TheKnot scraper](../theknot-scraper/) with BrowserAct, where costs would exceed $500/month for comprehensive data collection.

**Key Learnings:**
- Workflow-based approach works well
- Pagination is critical
- Error handling matters
- Templates accelerate development
- Cost at scale is prohibitive with SaaS

---

## 🤝 Contributing (Future)

Once we reach MVP, we'll open this up for contributions. For now, this is in active planning and development.

---

## 📖 BMAD Framework

This project follows the **BMAD Universal** framework:

- **Phase 1:** Analysis (Understanding the problem) ✅
- **Phase 2:** Planning (PRD creation) ✅
- **Phase 3:** Solutioning (Architecture, Epics) ⏳
- **Phase 4:** Implementation (Sprints, Stories) ⏳

**Current Phase:** Planning → Solutioning

---

## 📞 Contact

Questions? Check the [PRD](docs/PRD.md) or [project context](docs/project-context.md) first.

---

**Status:** ✅ Sprint 1 Complete - Modern UI & API Ready!  
**Next Step:** Sprint 2 - Complete n8n & CRM Integration  
**Last Updated:** January 26, 2026  
**Cost:** $0/month (run on your existing Windows PC)

---

## 🎉 Sprint 1 Complete!

All 8 stories completed (34 points):
- ✅ REST API with Fastify
- ✅ PostgreSQL database
- ✅ Job queue system
- ✅ Browser automation
- ✅ CSV/JSON export
- ✅ API authentication
- ✅ 15 integration tests (100% passing)

**Try it now:** See [QUICKSTART.md](./QUICKSTART.md) to test the API!

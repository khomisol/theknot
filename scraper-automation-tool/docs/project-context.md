# Project Context
# Web Scraping Automation Platform

**Created:** January 25, 2026  
**Status:** Planning Phase  
**Track:** BMAD Method

---

## Project Overview

Building a self-hosted web scraping automation platform to replace expensive SaaS tools like BrowserAct with a cost-effective, flexible, code-first solution.

### The Spark

While building the TheKnot scraper using BrowserAct, we discovered:
- **Cost Issue:** $0.05-0.10 per page = $500+/month for comprehensive scraping
- **Control Issue:** Limited customization, vendor lock-in
- **Learning:** We now understand the patterns needed for robust scraping

### The Vision

Create a tool that gives developers the power of Playwright/Puppeteer with the convenience of pre-built patterns, reducing both cost (70%+ savings) and development time (from 40 hours to 30 minutes).

---

## Key Insights from TheKnot Project

### What Worked Well
✅ Workflow-based approach (define once, run many times)  
✅ Parameter-based URLs for multi-location scraping  
✅ Automatic pagination handling  
✅ Structured data extraction  
✅ CSV/JSON export  

### Pain Points
❌ Credit-based pricing becomes expensive at scale  
❌ Limited customization for complex scenarios  
❌ No access to underlying code/logic  
❌ Can't optimize for specific use cases  
❌ Vendor dependency  

### Lessons Learned
1. **Pagination is critical** - Most scraping needs multi-page support
2. **Error handling matters** - Sites change, networks fail
3. **Selectors break** - Need flexible targeting strategies
4. **Rate limiting required** - Avoid getting blocked
5. **Templates accelerate** - Common patterns should be reusable

---

## Target Users

### Primary: Solo Developer Sam
- Building SaaS products that need data
- Scraping 10,000+ pages/month
- Budget: $50-100/month
- Tech-savvy but time-constrained

### Secondary: Agency Owner Alex
- Serving multiple clients
- Need white-label solutions
- Budget: $200-500/month
- Has development team

---

## Success Criteria

### Must Achieve (MVP)
- [ ] Create workflow in <30 minutes
- [ ] Cost <$0.01 per page scraped
- [ ] 90%+ success rate
- [ ] Handle pagination automatically
- [ ] Export to JSON/CSV

### Should Achieve (v1.0)
- [ ] Scheduling system
- [ ] REST API
- [ ] Proxy support
- [ ] Comprehensive templates
- [ ] Error recovery

### Nice to Have (v2.0)
- [ ] Web dashboard
- [ ] Visual workflow builder
- [ ] Workflow marketplace

---

## Technical Direction

### Core Stack
- **Language:** TypeScript/Node.js (familiar, fast iteration)
- **Browser:** Playwright (modern, well-maintained)
- **Database:** SQLite (simple) → PostgreSQL (scale)
- **Deployment:** Docker (portability)

### Architecture Principles
1. **Code-first:** Workflows defined in TypeScript
2. **Composable:** Reusable components
3. **Extensible:** Plugin system for custom logic
4. **Observable:** Comprehensive logging and monitoring
5. **Reliable:** Built-in retries and error handling

---

## Project Phases

### Phase 1: MVP (Weeks 1-4)
**Goal:** Prove the concept works

**Deliverables:**
- Core scraping engine
- Basic CLI
- JSON/CSV export
- Simple pagination

**Success Metric:** Can replicate TheKnot workflow

### Phase 2: Production (Weeks 5-8)
**Goal:** Make it reliable

**Deliverables:**
- Error handling & retries
- Scheduling system
- Workflow templates
- Complete documentation

**Success Metric:** Can run unattended for 7 days

### Phase 3: Scale (Weeks 9-12)
**Goal:** Make it powerful

**Deliverables:**
- REST API
- Web dashboard
- Proxy support
- Advanced features

**Success Metric:** 5+ active users

---

## Competitive Positioning

### vs. BrowserAct
**We win on:** Cost (70% cheaper), Control (full code access), Flexibility  
**They win on:** Ease of use (visual builder), No setup required  
**Our angle:** "BrowserAct for developers who want control"

### vs. Raw Playwright
**We win on:** Speed (templates), Patterns (built-in), Learning curve  
**They win on:** Ultimate flexibility, No abstraction  
**Our angle:** "Playwright with batteries included"

---

## Risk Management

### Top Risks
1. **Websites change frequently** → Build flexible selectors, monitoring
2. **Getting blocked** → Proxy support, rate limiting, delays
3. **Resource intensive** → Optimize, headless mode, scaling docs
4. **Maintenance burden** → Excellent docs, modular code, tests

---

## Open Questions

1. **Open source or proprietary?**
   - Leaning: Open source core, paid hosting/support

2. **Node.js or Python?**
   - Leaning: Node.js (faster iteration, better Playwright support)

3. **Self-hosted only or offer cloud?**
   - Leaning: Self-hosted first, cloud later

4. **Visual builder in v1?**
   - Leaning: No, code-first for MVP

---

## Resources

### Inspiration
- **BrowserAct:** What we're improving upon
- **Playwright:** Our foundation
- **Scrapy:** Architecture patterns
- **n8n:** Workflow orchestration ideas

### Reference Projects
- TheKnot scraper (../theknot-scraper/)
- BrowserAct workflows
- Playwright examples

---

## Next Steps

1. ✅ Create PRD (Complete)
2. ⏳ Review PRD with stakeholder
3. ⏳ Create Architecture document
4. ⏳ Break into Epics and Stories
5. ⏳ Sprint 1 planning

---

**Status:** PRD Complete - Awaiting Review  
**Last Updated:** January 25, 2026

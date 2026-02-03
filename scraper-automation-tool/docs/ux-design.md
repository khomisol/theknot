# UX Design Document
# Web Scraping Automation Platform

> **Feature**: All-in-One Dashboard & Scraping Interface  
> **Designer**: Sally (UX Designer)  
> **Date**: January 26, 2026  
> **Version**: 2.0 - Tailwind CSS Redesign

---

## Overview

A comprehensive web-based dashboard for managing web scraping jobs, viewing scraped data, and enriching venue information. The platform provides an intuitive interface for non-technical users to scrape TheKnot.com wedding venues without writing code.

**Key Features:**
- Dashboard with real-time job statistics
- Scraper form with location/category selection
- Database view with filtering and pagination
- Enrichment workflow for extracting additional details
- Real-time progress tracking with circular progress indicators

---

## User Problem

### Problem Statement
Users need to scrape wedding venue data from TheKnot.com but face challenges:
- BrowserAct costs $500-1,000/month (too expensive)
- Raw Playwright requires 40+ hours of coding (too complex)
- Manual scraping is time-consuming (not scalable)
- Need to track multiple scraping jobs and manage data

### Target Users

**Primary: Budget-Conscious Entrepreneur (Sam)**
- Small business owner building wedding vendor CRM
- Limited technical skills (can use n8n, understand APIs)
- Budget: $0/month for scraping
- Needs: Simple UI, automated scraping, data export

**Secondary: Automation Developer (Alex)**
- Developer building n8n/Zapier workflows
- High technical skills
- Needs: API-first design, reliable endpoints, webhook support

### User Goals
1. Submit scraping jobs with minimal configuration
2. Monitor job progress in real-time
3. View and filter scraped data easily
4. Export data in CSV/JSON formats
5. Enrich venue data with additional details (website, phone, social media)
6. Manage duplicate data

---

## User Research

### Findings
- Users prefer visual progress indicators over text-only status
- Real-time updates reduce anxiety during long-running jobs
- Filtering and search are critical for large datasets (1000+ venues)
- Users want to see "what's happening now" during scraping
- Export functionality must be obvious and accessible
- Dark mode is preferred for developer tools

### User Quotes
> "I need to know if it's actually working or if it's stuck"

> "BrowserAct is great but I can't justify $500/month for a side project"

> "I want to see the data as it comes in, not wait until the end"

> "Filtering by location is essential - I scrape multiple cities"

### Key Insights
1. **Progress Transparency**: Users need detailed progress (current page, items found, avg per page)
2. **Data Management**: Filtering, search, and pagination are must-haves
3. **Cost Visibility**: Emphasize $0/month cost advantage
4. **Error Recovery**: Clear error messages with screenshots
5. **Two-Pass Workflow**: Separate listing scraping from detail enrichment

---

## Design Solution

### Approach
**Dark Mode Dashboard with Sidebar Navigation**
- Modern dark theme reduces eye strain for long sessions
- Sidebar navigation for quick section switching
- Card-based layout for content organization
- Real-time progress with circular indicators
- Responsive design for mobile/tablet/desktop

**Design Principles:**
1. **Clarity**: Every action has clear feedback
2. **Efficiency**: Minimize clicks to complete tasks
3. **Transparency**: Show what's happening in real-time
4. **Forgiveness**: Easy to undo/retry actions
5. **Accessibility**: Keyboard navigation, screen reader support

### User Flow

```
[Landing: Dashboard] → View Stats & Recent Jobs
         ↓
[Navigate to Scraper] → Select Location & Category
         ↓
[Configure Job] → Set Max Pages, Format, Headless Mode
         ↓
[Submit Job] → See Real-Time Progress (circular indicator)
         ↓
[Job Complete] → Download CSV/JSON
         ↓
[Navigate to Database] → View All Data
         ↓
[Filter & Search] → Find Specific Venues
         ↓
[Navigate to Enrich] → Select Venues to Enrich
         ↓
[Submit Enrichment] → See Real-Time Progress
         ↓
[Enrichment Complete] → Download Enhanced Data
```

### Key Screens/States

#### State 1: Dashboard (Overview)
- **Purpose**: Show system status and recent activity
- **Elements**: 
  - 4 stat cards (Total Jobs, Completed, Items Scraped, Running)
  - Recent jobs list (last 5 jobs)
  - Quick actions (refresh)
- **Actions**: 
  - Click job to view details
  - Navigate to other sections

#### State 2: Scraper (Job Submission)
- **Purpose**: Configure and submit scraping jobs
- **Elements**:
  - Location dropdown (30+ cities)
  - Category dropdown (4 categories)
  - Max pages selector (custom or "all pages")
  - Format selector (CSV/JSON)
  - Headless mode toggle
  - Submit button
- **Actions**:
  - Select location/category
  - Configure options
  - Submit job
  - Watch real-time progress

#### State 3: Scraper Progress (Active Job)
- **Purpose**: Show real-time scraping progress
- **Elements**:
  - Circular progress indicator (0-100%)
  - Status text (Starting, Running, Completed, Failed)
  - Pages scraped (X / Y)
  - Current page number
  - Venues found (total)
  - Venues on current page
  - Average venues per page
- **Actions**:
  - Watch progress update every 2 seconds
  - Download results when complete

#### State 4: Database (Data View)
- **Purpose**: View, filter, and manage all scraped data
- **Elements**:
  - Filter controls (date, location, category, search)
  - Data stats (showing X-Y of Z items)
  - Pagination controls (prev/next, items per page)
  - Data table (responsive, sortable)
  - Action buttons (Load All, Cleanup, Export)
- **Actions**:
  - Apply filters
  - Search data
  - Navigate pages
  - Export to CSV
  - Cleanup duplicates

#### State 5: Enrich (Detail Enrichment)
- **Purpose**: Extract additional venue details (website, phone, social)
- **Elements**:
  - Job selector dropdown
  - Venue selection list (checkboxes)
  - Select all toggle
  - Headless mode toggle
  - Submit button
  - Circular progress indicator
- **Actions**:
  - Select job
  - Choose venues to enrich
  - Submit enrichment
  - Watch real-time progress
  - Download enhanced data

#### State 6: Cleanup Modal (Duplicate Management)
- **Purpose**: Detect and remove duplicate venues
- **Elements**:
  - Detect duplicates button
  - Duplicate groups list
  - Checkboxes for each duplicate
  - Remove button
  - Status messages
- **Actions**:
  - Detect duplicates
  - Review duplicate groups
  - Select duplicates to remove
  - Confirm removal

---

## Interaction Design

### Gestures/Actions
| Action | Trigger | Result |
|--------|---------|--------|
| Click nav item | Mouse click / Enter | Switch section, update active state |
| Submit form | Click button / Enter | Start job, show progress |
| Click job card | Mouse click | Navigate to database, filter by job |
| Toggle checkbox | Mouse click / Space | Select/deselect item |
| Type in search | Keyboard input | Filter data in real-time |
| Click pagination | Mouse click | Load next/prev page |
| Click download | Mouse click | Download CSV/JSON file |

### Micro-interactions
- **Loading**: Circular progress with percentage, animated stroke
- **Success**: Green checkmark, success message with download buttons
- **Error**: Red X, error message with screenshot link
- **Hover**: Subtle background color change, cursor pointer
- **Focus**: Blue outline for keyboard navigation
- **Transition**: Smooth 200-300ms transitions for state changes

### Transitions
- Section switching: Fade in/out (300ms)
- Progress updates: Smooth stroke animation (500ms)
- Modal open/close: Scale + fade (200ms)
- Button hover: Background color (200ms)
- Form validation: Shake animation for errors

---

## Visual Design (Tailwind CSS)

### Color Palette
```css
/* Primary Colors */
--primary: #6366f1 (indigo-500)
--primary-dark: #4f46e5 (indigo-600)
--primary-light: #818cf8 (indigo-400)

/* Status Colors */
--success: #10b981 (emerald-500)
--danger: #ef4444 (red-500)
--warning: #f59e0b (amber-500)
--info: #3b82f6 (blue-500)

/* Dark Theme */
--bg-dark: #0f172a (slate-900)
--bg-secondary: #1e293b (slate-800)
--bg-tertiary: #334155 (slate-700)
--text-primary: #f1f5f9 (slate-100)
--text-secondary: #cbd5e1 (slate-300)
--text-muted: #94a3b8 (slate-400)
--border: #334155 (slate-700)
```

### Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif

/* Font Sizes */
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)

/* Font Weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing
```css
/* Tailwind Spacing Scale */
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
```

### Components Used
- [x] Button (primary, secondary, danger, icon)
- [x] Input (text, number, select, checkbox)
- [x] Modal (cleanup duplicates)
- [x] Card (stat cards, content cards)
- [x] List (jobs list, venue list, duplicates list)
- [x] Table (data table with sticky header)
- [x] Progress (circular progress indicator)
- [x] Badge (status badges)
- [x] Sidebar (navigation)
- [x] Top Bar (section title, search)

### Responsive Behavior
| Breakpoint | Adaptation |
|------------|------------|
| Mobile (<768px) | Sidebar collapses to icons only, single column layout, stack filters vertically |
| Tablet (768-1024px) | 2-column grid for stats, sidebar shows icons + text, filters in 2 columns |
| Desktop (>1024px) | Full layout, 4-column grid for stats, sidebar expanded, filters in 4 columns |

---

## Accessibility

### Requirements
- [x] Keyboard navigation (Tab, Enter, Space, Arrow keys)
- [x] Screen reader support (ARIA labels, semantic HTML)
- [x] Color contrast (WCAG AA - 4.5:1 for text)
- [x] Focus indicators (blue outline, visible on all interactive elements)
- [x] Error messaging (clear, actionable, associated with inputs)
- [x] Skip links (skip to main content)
- [x] Responsive text sizing (rem units, respects user preferences)

### ARIA Labels
| Element | Label |
|---------|-------|
| Sidebar nav | `aria-label="Main navigation"` |
| Nav items | `aria-current="page"` for active |
| Progress circle | `role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"` |
| Modal | `role="dialog" aria-modal="true" aria-labelledby="modal-title"` |
| Search input | `aria-label="Search venues"` |
| Pagination | `aria-label="Pagination navigation"` |
| Status messages | `role="status" aria-live="polite"` |
| Error messages | `role="alert" aria-live="assertive"` |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Tab | Navigate forward through interactive elements |
| Shift+Tab | Navigate backward |
| Enter | Activate button/link, submit form |
| Space | Toggle checkbox, activate button |
| Escape | Close modal |
| Arrow keys | Navigate dropdown options |

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty state (no jobs) | Show friendly message: "No jobs yet. Start your first scraping job!" |
| Empty state (no data) | Show message: "No data found. Try adjusting your filters." |
| Error state (job failed) | Show error message with screenshot link, retry button |
| Loading state | Show circular progress with percentage, status text |
| Long content (venue name) | Truncate with ellipsis, show full text on hover |
| No results (search) | Show "No results found for '[query]'" |
| Network error | Show error message: "Connection lost. Retrying..." |
| Large dataset (10K+ items) | Pagination with 30 items per page, virtual scrolling for future |
| Duplicate detection (0 found) | Show success message: "No duplicates found!" |
| All pages selected (999) | Show "All Pages" instead of "999 / 999" |

---

## Testing Considerations

### Usability Tests
- [x] Task: Submit a scraping job - Success: User completes in <2 minutes
- [x] Task: Find a specific venue - Success: User uses search/filters successfully
- [x] Task: Export data to CSV - Success: User downloads file in <30 seconds
- [x] Task: Enrich venue details - Success: User selects venues and starts enrichment
- [x] Task: Remove duplicates - Success: User detects and removes duplicates

### A/B Tests
- **Hypothesis**: Circular progress indicator increases user confidence vs text-only
- **Variants**: 
  - A: Circular progress with detailed stats
  - B: Text-only progress updates
- **Metrics**: User satisfaction, perceived wait time, task completion rate

### Performance Tests
- [ ] Page load time <2 seconds
- [ ] Progress updates every 2 seconds (no lag)
- [ ] Table renders 1000+ rows smoothly
- [ ] Search filters data in <500ms
- [ ] Modal opens/closes in <200ms

---

## Design Assets

- **Figma**: [To be created]
- **Prototype**: [To be created]
- **Assets**: 
  - Icons: Emoji-based (🕷️, 📊, 🚀, 💾, ✨)
  - Fonts: Inter (Google Fonts)
  - Colors: Tailwind CSS default palette

---

## Implementation Notes

### Tailwind CSS Setup
```html
<!-- CDN (for quick prototyping) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Or npm install (production) -->
npm install -D tailwindcss
npx tailwindcss init
```

### Custom Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'dark': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-tertiary': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
}
```

### Component Examples

**Button (Primary)**
```html
<button class="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2">
  🚀 Start Scraping
</button>
```

**Card**
```html
<div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
  <h3 class="text-xl font-semibold mb-4">Card Title</h3>
  <p class="text-slate-300">Card content</p>
</div>
```

**Progress Circle**
```html
<div class="relative w-30 h-30">
  <svg class="transform -rotate-90" width="120" height="120">
    <circle class="text-slate-700" stroke="currentColor" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
    <circle class="text-emerald-500" stroke="currentColor" stroke-width="8" fill="transparent" r="52" cx="60" cy="60" 
            stroke-dasharray="326.73" stroke-dashoffset="163.37" stroke-linecap="round"/>
  </svg>
  <div class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-500">
    50%
  </div>
</div>
```

---

## Future Enhancements

### Phase 2 (Post-MVP)
1. **Dark/Light Mode Toggle**: Allow users to switch themes
2. **Saved Filters**: Save common filter combinations
3. **Job Templates**: Save scraping configurations for reuse
4. **Bulk Actions**: Select multiple jobs for batch operations
5. **Data Visualization**: Charts for scraping trends, venue distribution
6. **Advanced Search**: Boolean operators, regex support
7. **Column Customization**: Show/hide table columns
8. **Export Presets**: Custom CSV column selection

### Phase 3 (Advanced)
1. **Collaborative Features**: Share jobs/data with team
2. **Scheduled Scraping**: Cron-like job scheduling
3. **Webhook Configuration UI**: Visual webhook setup
4. **API Key Management**: Generate/revoke API keys in UI
5. **Audit Log**: Track all user actions
6. **Mobile App**: Native iOS/Android apps

---

## Sign-off

| Role | Name | Date | Approval |
|------|------|------|----------|
| Product | PM (John) | 2026-01-26 | ✅ Approved |
| Engineering | Developer (Amelia) | 2026-01-26 | ✅ Approved |
| QA | TEA (Murat) | 2026-01-26 | ✅ Approved |
| UX | Sally (UX Designer) | 2026-01-26 | ✅ Approved |

---

**Status:** ✅ Approved for Implementation  
**Next Steps:** Refactor UI to use Tailwind CSS  
**Timeline:** 4-6 hours for complete redesign  
**Framework:** BMAD Universal 1.0.0

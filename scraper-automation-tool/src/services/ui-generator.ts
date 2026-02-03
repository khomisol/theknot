/**
 * UI Generator using Gemini AI
 * Generates HTML/CSS designs using AI
 */

import { geminiService } from './gemini-service';

export async function generateConsolidatedUI(): Promise<string> {
  const prompt = `Generate a complete, modern HTML page for a web scraping platform with these requirements:

FEATURES TO INCLUDE:
1. Scraper Form - Submit scraping jobs (location, category, max pages)
2. Database View - View and search scraped data in a table
3. Enrichment - Select venues and enrich with details
4. Duplicate Cleanup - Auto-detect and remove duplicates
5. Export Options - Download as CSV/JSON
6. Job History - View recent jobs with status

DESIGN REQUIREMENTS:
- Single-page application with sidebar navigation
- Modern, professional design (Material Design inspired)
- Dark theme with accent colors
- Responsive layout
- Smooth transitions
- Cards for each section
- Real-time status updates
- Progress indicators

LAYOUT:
- Left sidebar: Navigation menu (Dashboard, Scraper, Database, Enrichment, Settings)
- Main content area: Dynamic content based on selected menu
- Top bar: Title, search, user actions

FEATURES:
- Duplicate detection with merge options
- Bulk operations (select multiple items)
- Advanced filters (rating, price range, location)
- Export with custom field selection
- Job scheduling (future feature placeholder)

Return ONLY the complete HTML with inline CSS and JavaScript. Make it production-ready.`;

  try {
    const html = await geminiService.model?.generateContent(prompt);
    const response = await html?.response;
    return response?.text() || '';
  } catch (error) {
    console.error('UI generation failed:', error);
    return '';
  }
}

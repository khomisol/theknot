/**
 * Exploration Script: TheKnot Pagination
 * Story 2.4 - Analyze pagination controls
 */

import { chromium } from 'playwright';

async function explorePagination() {
  console.log('🔍 Exploring TheKnot pagination...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to a search with multiple pages
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Look for pagination controls
    console.log('🔎 Searching for pagination controls...\n');

    // Try common pagination selectors
    const selectors = [
      'button[aria-label*="next"]',
      'button[aria-label*="Next"]',
      'a[aria-label*="next"]',
      'a[aria-label*="Next"]',
      '[data-testid*="pagination"]',
      '[data-testid*="next"]',
      '.pagination',
      '[class*="pagination"]',
      '[class*="Pagination"]',
      'nav[aria-label*="pagination"]',
      'nav[aria-label*="Pagination"]',
    ];

    for (const selector of selectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} element(s) with: ${selector}`);

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          const text = await el.textContent();
          const ariaLabel = await el.getAttribute('aria-label');
          const disabled = await el.getAttribute('disabled');
          const href = await el.getAttribute('href');

          console.log(`   Element ${i + 1}:`);
          console.log(`     Text: ${text?.trim()}`);
          console.log(`     Aria-label: ${ariaLabel}`);
          console.log(`     Disabled: ${disabled}`);
          console.log(`     Href: ${href}`);
          console.log('');
        }
      }
    }

    // Look for page numbers
    console.log('\n🔢 Looking for page numbers...\n');
    const pageNumberSelectors = [
      'button[aria-label*="page"]',
      'a[aria-label*="page"]',
      '[data-testid*="page"]',
      '[class*="page-number"]',
    ];

    for (const selector of pageNumberSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(
          `✅ Found ${elements.length} page number element(s) with: ${selector}`
        );
      }
    }

    // Scroll to bottom to see pagination
    console.log('\n📜 Scrolling to bottom...\n');
    // @ts-ignore - DOM types not available in Node context
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: 'scraper-automation-tool/data/pagination-exploration.png',
      fullPage: true,
    });
    console.log('📸 Screenshot saved: data/pagination-exploration.png\n');

    console.log('⏸️  Pausing for manual inspection (30 seconds)...');
    console.log('   Check the browser window and console output');
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

explorePagination();

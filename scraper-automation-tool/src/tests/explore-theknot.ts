/**
 * Exploration script to analyze TheKnot page structure
 * Run with: npx tsx src/tests/explore-theknot.ts
 */

import { chromium } from 'playwright';

async function exploreTheKnot() {
  console.log('🔍 Exploring TheKnot page structure...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('✅ Page loaded\n');

    // Wait for content to load
    console.log('⏳ Waiting for content...');
    await page.waitForTimeout(5000);

    // Try to find venue cards with various selectors
    const possibleSelectors = [
      'article',
      '[data-testid*="vendor"]',
      '[data-testid*="card"]',
      '.vendor-card',
      '.search-result',
      '[class*="vendor"]',
      '[class*="card"]',
      '[class*="result"]',
    ];

    console.log('🔎 Testing selectors...\n');

    for (const selector of possibleSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} elements with: ${selector}`);

        // Get first element's HTML for inspection
        const firstElement = elements[0];
        const html = await firstElement.evaluate((el) =>
          el.outerHTML.substring(0, 500)
        );
        console.log(`   Sample HTML: ${html}...\n`);
      }
    }

    // Try to find links
    console.log('🔗 Looking for venue links...\n');
    const links = await page.$$('a[href*="/marketplace/"]');
    console.log(`Found ${links.length} marketplace links`);

    if (links.length > 0) {
      const firstLink = links[0];
      const href = await firstLink.getAttribute('href');
      const text = await firstLink.textContent();
      console.log(`   First link: ${text?.trim()} -> ${href}\n`);
    }

    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}\n`);

    // Take screenshot
    await page.screenshot({ path: 'theknot-page.png', fullPage: true });
    console.log('📸 Screenshot saved: theknot-page.png\n');

    console.log('⏸️  Pausing for manual inspection (30 seconds)...');
    console.log('   Check the browser window and screenshot');
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Done!');
  }
}

exploreTheKnot();

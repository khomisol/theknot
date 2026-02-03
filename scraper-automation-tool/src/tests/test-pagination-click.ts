/**
 * Test Script: TheKnot Pagination Click
 * Story 2.4 - Test clicking pagination
 */

import { chromium } from 'playwright';

async function testPaginationClick() {
  console.log('🔍 Testing TheKnot pagination click...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to a search with multiple pages
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Scroll to bottom to see pagination
    // @ts-ignore - DOM types not available in Node context
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Look for pagination links with "page" in aria-label
    console.log('🔎 Looking for pagination links...\n');
    const pageLinks = await page.$$('a[aria-label*="page"]');
    console.log(`Found ${pageLinks.length} page links\n`);

    for (let i = 0; i < pageLinks.length; i++) {
      const link = pageLinks[i];
      const ariaLabel = await link.getAttribute('aria-label');
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      console.log(`Link ${i + 1}:`);
      console.log(`  Aria-label: ${ariaLabel}`);
      console.log(`  Href: ${href}`);
      console.log(`  Text: ${text?.trim()}`);
      console.log('');
    }

    // Find "Next" or page 2 link
    console.log('🔍 Looking for Next/Page 2 link...\n');
    const nextLink = await page.$(
      'a[aria-label*="page 2"], a[aria-label*="Page 2"], a[aria-label*="next"], a[aria-label*="Next"]'
    );

    if (nextLink) {
      const ariaLabel = await nextLink.getAttribute('aria-label');
      console.log(`✅ Found next page link: ${ariaLabel}\n`);

      // Get current URL
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}\n`);

      // Click the link
      console.log('🖱️  Clicking next page link...\n');
      await nextLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Get new URL
      const newUrl = page.url();
      console.log(`New URL: ${newUrl}\n`);

      if (newUrl !== currentUrl) {
        console.log('✅ Successfully navigated to next page!\n');

        // Check if we can go back or forward
        console.log('🔍 Looking for page 1 link...\n');
        const page1Link = await page.$(
          'a[aria-label*="page 1"], a[aria-label*="Page 1"]'
        );
        if (page1Link) {
          console.log('✅ Found page 1 link (can go back)\n');
        }

        // Look for page 3 link
        console.log('🔍 Looking for page 3 link...\n');
        const page3Link = await page.$(
          'a[aria-label*="page 3"], a[aria-label*="Page 3"]'
        );
        if (page3Link) {
          console.log('✅ Found page 3 link (can go forward)\n');
        } else {
          console.log('❌ No page 3 link (might be on last page)\n');
        }
      } else {
        console.log('❌ URL did not change\n');
      }
    } else {
      console.log('❌ No next page link found\n');
    }

    console.log('⏸️  Pausing for manual inspection (20 seconds)...');
    await page.waitForTimeout(20000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testPaginationClick();

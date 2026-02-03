/**
 * Test script to extract actual data from TheKnot
 * Run with: npx tsx src/tests/extract-theknot-data.ts
 */

import { chromium } from 'playwright';

async function extractTheKnotData() {
  console.log('🔍 Extracting data from TheKnot...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('✅ Page loaded\n');

    // Wait for content
    await page.waitForTimeout(5000);

    // Find venue cards
    const venueCards = await page.$$('[data-testid="vendor-card-base"]');
    console.log(`📦 Found ${venueCards.length} venue cards\n`);

    // Extract data from first 3 cards
    for (let i = 0; i < Math.min(3, venueCards.length); i++) {
      const card = venueCards[i];
      console.log(`\n--- Venue ${i + 1} ---`);

      // Try to find venue name
      let venueName = '';

      // First try: Look for aria-label on the card
      try {
        const ariaLabel = await card.getAttribute('aria-labelledby');
        if (ariaLabel) {
          const labelEl = await page.$(`#${ariaLabel}`);
          if (labelEl) {
            const labelText = await labelEl.textContent();
            if (labelText) {
              venueName = labelText.trim();
              console.log(`  Name (aria-label): ${venueName}`);
            }
          }
        }
      } catch (e) {
        // Continue
      }

      // Second try: Extract from URL slug
      if (!venueName) {
        try {
          const linkEl = await card.$('a[href*="/marketplace/"]');
          if (linkEl) {
            const href = await linkEl.getAttribute('href');
            if (href) {
              // Extract name from URL like: /marketplace/fremont-foundry-by-landmark-event-co-seattle-wa-1009625
              const parts = href.split('/').pop()?.split('-');
              if (parts && parts.length > 2) {
                // Remove last 2 parts (state and ID)
                const nameParts = parts.slice(0, -2);
                venueName = nameParts
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                console.log(`  Name (from URL): ${venueName}`);
              }
            }
          }
        } catch (e) {
          console.log('  Name: Not found');
        }
      }

      // Try to find location
      const locationSelectors = [
        '[data-testid*="location"]',
        '[data-testid*="address"]',
        'address',
        '[class*="location"]',
        '[class*="address"]',
      ];

      for (const selector of locationSelectors) {
        try {
          const locEl = await card.$(selector);
          if (locEl) {
            const location = await locEl.textContent();
            if (location && location.trim().length > 0) {
              console.log(`  Location (${selector}): ${location.trim()}`);
              break;
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Try to find URL
      try {
        const linkEl = await card.$('a[href*="/marketplace/"]');
        if (linkEl) {
          const href = await linkEl.getAttribute('href');
          console.log(`  URL: ${href}`);
        }
      } catch (e) {
        console.log('  URL: Not found');
      }

      // Get all text content for analysis
      const allText = await card.textContent();
      console.log(`  All text (first 200 chars): ${allText?.substring(0, 200).replace(/\s+/g, ' ')}...`);
    }

    console.log('\n\n⏸️  Pausing for manual inspection (20 seconds)...');
    await page.waitForTimeout(20000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Done!');
  }
}

extractTheKnotData();

/**
 * Exploration script to find rating, reviews, and price selectors
 * Run with: npx tsx src/tests/explore-enhanced-fields.ts
 */

import { chromium } from 'playwright';

async function exploreEnhancedFields() {
  console.log('🔍 Exploring enhanced fields (rating, reviews, price)...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('✅ Page loaded\n');

    await page.waitForTimeout(5000);

    const venueCards = await page.$$('[data-testid="vendor-card-base"]');
    console.log(`📦 Found ${venueCards.length} venue cards\n`);

    // Analyze first 3 cards
    for (let i = 0; i < Math.min(3, venueCards.length); i++) {
      const card = venueCards[i];
      console.log(`\n--- Venue ${i + 1} ---`);

      // Get venue name for reference
      const ariaLabelId = await card.getAttribute('aria-labelledby');
      if (ariaLabelId) {
        const labelEl = await page.$(`#${ariaLabelId}`);
        if (labelEl) {
          const name = await labelEl.textContent();
          console.log(`  Name: ${name?.trim()}`);
        }
      }

      // Look for rating
      console.log('\n  🌟 Looking for rating...');
      const ratingSelectors = [
        '[data-testid*="rating"]',
        '[aria-label*="rating"]',
        '[class*="rating"]',
        '[class*="star"]',
        'svg[aria-label*="star"]',
      ];

      for (const selector of ratingSelectors) {
        try {
          const el = await card.$(selector);
          if (el) {
            const text = await el.textContent();
            const ariaLabel = await el.getAttribute('aria-label');
            console.log(`    Found (${selector}): text="${text?.trim()}" aria-label="${ariaLabel}"`);
          }
        } catch (e) {
          // Continue
        }
      }

      // Look for reviews
      console.log('\n  💬 Looking for reviews...');
      const reviewSelectors = [
        '[data-testid*="review"]',
        '[class*="review"]',
        'text=/\\d+\\s+reviews?/i',
        'text=/\\(\\d+\\)/i',
      ];

      for (const selector of reviewSelectors) {
        try {
          const el = await card.$(selector);
          if (el) {
            const text = await el.textContent();
            console.log(`    Found (${selector}): "${text?.trim()}"`);
          }
        } catch (e) {
          // Continue
        }
      }

      // Look for price
      console.log('\n  💰 Looking for price...');
      const priceSelectors = [
        '[data-testid*="price"]',
        '[class*="price"]',
        '[class*="cost"]',
        'text=/\\$\\$+/i',
        'text=/\\$[\\d,]+/i',
        'text=/starting at/i',
      ];

      for (const selector of priceSelectors) {
        try {
          const el = await card.$(selector);
          if (el) {
            const text = await el.textContent();
            console.log(`    Found (${selector}): "${text?.trim()}"`);
          }
        } catch (e) {
          // Continue
        }
      }

      // Get all text for analysis
      const allText = await card.textContent();
      console.log(`\n  📄 All text (first 300 chars):`);
      console.log(`    ${allText?.substring(0, 300).replace(/\s+/g, ' ')}...`);
    }

    console.log('\n\n⏸️  Pausing for manual inspection (30 seconds)...');
    console.log('   Check the browser window to see the actual page');
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Done!');
  }
}

exploreEnhancedFields();

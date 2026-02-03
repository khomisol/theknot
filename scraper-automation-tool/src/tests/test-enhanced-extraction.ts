/**
 * Test enhanced field extraction with parsing
 * Run with: npx tsx src/tests/test-enhanced-extraction.ts
 */

import { chromium } from 'playwright';

async function testEnhancedExtraction() {
  console.log('🧪 Testing enhanced field extraction...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url =
      'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa';
    console.log(`📍 Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    const venueCards = await page.$$('[data-testid="vendor-card-base"]');
    console.log(`📦 Found ${venueCards.length} venue cards\n`);

    // Extract from first 5 cards
    for (let i = 0; i < Math.min(5, venueCards.length); i++) {
      const card = venueCards[i];
      console.log(`\n--- Venue ${i + 1} ---`);

      // Get name
      const ariaLabelId = await card.getAttribute('aria-labelledby');
      let name = '';
      if (ariaLabelId) {
        const labelEl = await page.$(`#${ariaLabelId}`);
        if (labelEl) {
          name = (await labelEl.textContent())?.trim() || '';
        }
      }
      console.log(`  Name: ${name}`);

      // Extract rating and reviews
      const reviewEl = await card.$('[class*="review"]');
      if (reviewEl) {
        const reviewText = await reviewEl.textContent();
        console.log(`  Raw review text: "${reviewText}"`);

        // Parse: "4.1Stars(17)Reviews"
        const ratingMatch = reviewText?.match(/([\d.]+)Stars/);
        const reviewsMatch = reviewText?.match(/\((\d+)\)/);

        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
        const reviews = reviewsMatch ? parseInt(reviewsMatch[1]) : undefined;

        console.log(`  ⭐ Rating: ${rating}`);
        console.log(`  💬 Reviews: ${reviews}`);
      } else {
        console.log(`  ⭐ Rating: Not found`);
        console.log(`  💬 Reviews: Not found`);
      }

      // Extract price
      const priceEl = await card.$('[class*="price"]');
      if (priceEl) {
        const priceText = await priceEl.textContent();
        console.log(`  💰 Price: ${priceText?.trim()}`);
      } else {
        console.log(`  💰 Price: Not found`);
      }
    }

    console.log('\n\n⏸️  Pausing (15 seconds)...');
    await page.waitForTimeout(15000);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Done!');
  }
}

testEnhancedExtraction();

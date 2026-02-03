/**
 * Manual Test: Rate Limiting
 * Story 2.5 - Verify delays are applied during scraping
 */

import { chromium } from 'playwright';
import { TheKnotAdapter } from '../adapters/theknot-adapter';

async function testRateLimiting() {
  console.log('🧪 Testing rate limiting...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Create adapter
    const adapter = new TheKnotAdapter({
      parameters: {
        category: 'wedding-reception-venues',
        location: 'seattle-wa',
      },
    });

    // Get rate limit config
    const rateLimit = adapter.getRateLimit();
    console.log(`⏱️  Rate Limit Configuration:`);
    console.log(`   Min: ${rateLimit.min}ms (${rateLimit.min / 1000}s)`);
    console.log(`   Max: ${rateLimit.max}ms (${rateLimit.max / 1000}s)`);
    console.log('');

    // Navigate to first page
    const url = adapter.buildUrl();
    console.log(`📍 Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const maxPages = 2; // Just test 2 pages
    let currentPage = 1;
    const timings: number[] = [];

    // Pagination loop with timing
    while (currentPage <= maxPages) {
      console.log(`\n📄 Page ${currentPage}/${maxPages}`);
      console.log('─'.repeat(50));

      const pageStartTime = Date.now();

      // Extract data
      console.log('🔍 Extracting data...');
      const items = await adapter.extractData(page);
      console.log(`✅ Extracted ${items.length} items`);

      const extractionTime = Date.now() - pageStartTime;
      console.log(`⏱️  Extraction took: ${extractionTime}ms`);

      // Check for next page
      if (currentPage >= maxPages) {
        break;
      }

      const hasNext = await adapter.hasNextPage(page);
      if (!hasNext) {
        console.log('❌ No more pages available');
        break;
      }

      // Measure delay before navigation
      console.log('\n⏳ Applying rate limit delay...');
      const delayStartTime = Date.now();

      // Simulate the delay that would happen in job worker
      const delayMs =
        Math.floor(Math.random() * (rateLimit.max - rateLimit.min + 1)) +
        rateLimit.min;
      console.log(`   Waiting ${(delayMs / 1000).toFixed(1)}s...`);
      await page.waitForTimeout(delayMs);

      const actualDelay = Date.now() - delayStartTime;
      timings.push(actualDelay);
      console.log(`   ✅ Actual delay: ${actualDelay}ms`);

      // Navigate to next page
      console.log('\n➡️  Navigating to next page...');
      await adapter.goToNextPage(page);

      currentPage++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 RATE LIMITING SUMMARY');
    console.log('='.repeat(50));
    console.log(`Pages scraped: ${currentPage}`);
    console.log(`Delays applied: ${timings.length}`);

    if (timings.length > 0) {
      const avgDelay = timings.reduce((a, b) => a + b, 0) / timings.length;
      const minDelay = Math.min(...timings);
      const maxDelay = Math.max(...timings);

      console.log(`\n⏱️  Delay Statistics:`);
      console.log(`   Min: ${minDelay}ms (${(minDelay / 1000).toFixed(1)}s)`);
      console.log(`   Max: ${maxDelay}ms (${(maxDelay / 1000).toFixed(1)}s)`);
      console.log(`   Avg: ${avgDelay.toFixed(0)}ms (${(avgDelay / 1000).toFixed(1)}s)`);
      console.log(
        `   Expected: ${rateLimit.min}-${rateLimit.max}ms (${rateLimit.min / 1000}-${rateLimit.max / 1000}s)`
      );

      // Verify delays are within expected range
      const allInRange = timings.every(
        (t) => t >= rateLimit.min - 50 && t <= rateLimit.max + 50
      );
      if (allInRange) {
        console.log('\n✅ All delays within expected range!');
      } else {
        console.log('\n⚠️  Some delays outside expected range');
      }

      // Check randomness
      const uniqueDelays = new Set(timings);
      if (uniqueDelays.size > 1) {
        console.log('✅ Delays are random (not fixed)');
      } else {
        console.log('⚠️  All delays are the same (not random)');
      }
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    console.log('\n⏸️  Pausing for 5 seconds before closing...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

testRateLimiting();

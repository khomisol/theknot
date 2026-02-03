/**
 * Manual Test: Pagination End-to-End
 * Story 2.4 - Test multi-page scraping
 *
 * This script tests the complete pagination flow:
 * 1. Navigate to first page
 * 2. Extract data
 * 3. Check for next page
 * 4. Navigate to next page
 * 5. Repeat for maxPages
 */

import { chromium } from 'playwright';
import { TheKnotAdapter } from '../adapters/theknot-adapter';

async function testPaginationManual() {
  console.log('🧪 Testing pagination end-to-end...\n');

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

    // Navigate to first page
    const url = adapter.buildUrl();
    console.log(`📍 Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const maxPages = 3;
    let currentPage = 1;
    const allItems: any[] = [];

    // Pagination loop
    while (currentPage <= maxPages) {
      console.log(`\n📄 Page ${currentPage}/${maxPages}`);
      console.log('─'.repeat(50));

      // Extract data from current page
      console.log('🔍 Extracting data...');
      const items = await adapter.extractData(page);
      console.log(`✅ Extracted ${items.length} items`);

      allItems.push(...items);

      // Show first 3 items
      if (items.length > 0) {
        console.log('\n📋 Sample items:');
        items.slice(0, 3).forEach((item, i) => {
          console.log(`  ${i + 1}. ${item.name}`);
          console.log(`     Location: ${item.location || 'N/A'}`);
          console.log(`     Rating: ${item.rating || 'N/A'}`);
          console.log(`     Price: ${item.price || 'N/A'}`);
        });
      }

      // Check if we've reached max pages
      if (currentPage >= maxPages) {
        console.log(`\n⚠️  Reached max pages limit (${maxPages})`);
        break;
      }

      // Check for next page
      console.log('\n🔍 Checking for next page...');
      const hasNext = await adapter.hasNextPage(page);

      if (!hasNext) {
        console.log('❌ No more pages available');
        break;
      }

      console.log('✅ Next page available');

      // Navigate to next page
      console.log('➡️  Navigating to next page...');
      await adapter.goToNextPage(page);
      console.log('✅ Navigation successful');

      currentPage++;

      // Small delay between pages
      await page.waitForTimeout(2000);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Pages scraped: ${currentPage}`);
    console.log(`Total items: ${allItems.length}`);
    console.log(`Average items per page: ${(allItems.length / currentPage).toFixed(1)}`);

    // Show distribution
    console.log('\n📈 Items per page:');
    let itemCount = 0;
    for (let i = 1; i <= currentPage; i++) {
      const pageItems = allItems.slice(itemCount, itemCount + 30); // Assuming ~30 per page
      console.log(`  Page ${i}: ~${pageItems.length} items`);
      itemCount += 30;
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

testPaginationManual();

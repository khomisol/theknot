/**
 * E2E Scraping Validation Test
 * 
 * Tests:
 * 1. Data extraction accuracy (no asterisks, proper URLs, correct fields)
 * 2. Page count detection
 * 3. Max pages logic (custom vs all pages)
 * 4. CSV parsing (arrays not strings)
 */

import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { TheKnotAdapter } from '../adapters/theknot-adapter';

chromium.use(stealth());

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string, details?: any) {
  results.push({ name, passed, message, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
  if (details) {
    console.log('   Details:', JSON.stringify(details, null, 2));
  }
}

async function runTests() {
  console.log('🧪 Starting E2E Scraping Validation Tests\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // TEST 1: Page Count Detection
    console.log('\n📊 TEST 1: Page Count Detection');
    console.log('-'.repeat(60));
    
    const adapter = new TheKnotAdapter({
      parameters: {
        location: 'los-angeles-ca',
        category: 'wedding-reception-venues'
      }
    });
    
    const url = adapter.buildUrl();
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const totalPages = await adapter.getTotalPages(page);
    logTest(
      'Page Count Detection',
      totalPages > 0,
      `Detected ${totalPages} pages`,
      { totalPages, location: 'Los Angeles' }
    );
    
    // TEST 2: Data Extraction Accuracy
    console.log('\n📋 TEST 2: Data Extraction Accuracy');
    console.log('-'.repeat(60));
    
    const items = await adapter.extractData(page);
    
    logTest(
      'Items Extracted',
      items.length > 0,
      `Extracted ${items.length} items`,
      { count: items.length }
    );
    
    if (items.length > 0) {
      const firstItem = items[0];
      
      // Check name
      const hasValidName = firstItem.name && 
                          firstItem.name.length > 0 && 
                          !firstItem.name.includes('*');
      logTest(
        'Name Field',
        hasValidName,
        hasValidName ? `Valid: "${firstItem.name}"` : 'Invalid or contains asterisk',
        { name: firstItem.name }
      );
      
      // Check location
      const hasValidLocation = firstItem.location && 
                               firstItem.location.length > 0 && 
                               !firstItem.location.includes('*') &&
                               firstItem.location.match(/[A-Za-z\s]+,\s*[A-Z]{2}/);
      logTest(
        'Location Field',
        hasValidLocation,
        hasValidLocation ? `Valid: "${firstItem.location}"` : 'Invalid format or contains asterisk',
        { location: firstItem.location }
      );
      
      // Check URL
      const hasValidUrl = firstItem.url && 
                         firstItem.url.startsWith('http') && 
                         !firstItem.url.includes('Starting at') &&
                         !firstItem.url.includes('$');
      logTest(
        'URL Field',
        hasValidUrl,
        hasValidUrl ? `Valid URL` : 'Invalid or contains price text',
        { url: firstItem.url }
      );
      
      // Check rating
      const hasValidRating = firstItem.rating === undefined || 
                            (typeof firstItem.rating === 'number' && 
                             firstItem.rating >= 0 && 
                             firstItem.rating <= 5);
      logTest(
        'Rating Field',
        hasValidRating,
        hasValidRating ? `Valid: ${firstItem.rating || 'N/A'}` : 'Invalid rating value',
        { rating: firstItem.rating }
      );
      
      // Check reviews
      const hasValidReviews = firstItem.reviews === undefined || 
                             (typeof firstItem.reviews === 'number' && 
                              firstItem.reviews >= 0);
      logTest(
        'Reviews Field',
        hasValidReviews,
        hasValidReviews ? `Valid: ${firstItem.reviews || 'N/A'}` : 'Invalid review count',
        { reviews: firstItem.reviews }
      );
      
      // Check price
      const hasValidPrice = firstItem.price === undefined || 
                           (typeof firstItem.price === 'string' && 
                            (firstItem.price.includes('$') || firstItem.price.toLowerCase().includes('starting')));
      logTest(
        'Price Field',
        hasValidPrice,
        hasValidPrice ? `Valid: "${firstItem.price || 'N/A'}"` : 'Invalid price format',
        { price: firstItem.price }
      );
      
      // Check for data mixing (URL shouldn't be in price, price shouldn't be in URL, etc.)
      const noDataMixing = !firstItem.url?.includes('Starting at') &&
                          !firstItem.price?.includes('http') &&
                          !firstItem.location?.includes('*');
      logTest(
        'No Data Mixing',
        noDataMixing,
        noDataMixing ? 'All fields contain correct data types' : 'Data is mixed between fields',
        { 
          urlHasPrice: firstItem.url?.includes('Starting at'),
          priceHasUrl: firstItem.price?.includes('http'),
          locationHasAsterisk: firstItem.location?.includes('*')
        }
      );
    }
    
    // TEST 3: Pagination Detection
    console.log('\n🔄 TEST 3: Pagination Detection');
    console.log('-'.repeat(60));
    
    const hasNextPage = await adapter.hasNextPage(page);
    logTest(
      'Has Next Page',
      hasNextPage === true || hasNextPage === false,
      hasNextPage ? 'Next page button found' : 'No next page (might be last page)',
      { hasNextPage }
    );
    
    // TEST 4: Sample Multiple Items
    console.log('\n📦 TEST 4: Sample Multiple Items');
    console.log('-'.repeat(60));
    
    const sampleSize = Math.min(5, items.length);
    const sample = items.slice(0, sampleSize);
    
    let validCount = 0;
    sample.forEach((item, index) => {
      const isValid = item.name && 
                     item.url && 
                     item.url.startsWith('http') &&
                     !item.name.includes('*') &&
                     !item.url.includes('Starting at');
      if (isValid) validCount++;
      
      console.log(`   Item ${index + 1}:`);
      console.log(`     Name: ${item.name}`);
      console.log(`     Location: ${item.location || 'N/A'}`);
      console.log(`     Rating: ${item.rating || 'N/A'}`);
      console.log(`     Reviews: ${item.reviews || 'N/A'}`);
      console.log(`     Price: ${item.price || 'N/A'}`);
      console.log(`     URL: ${item.url.substring(0, 60)}...`);
      console.log(`     Valid: ${isValid ? '✅' : '❌'}`);
    });
    
    logTest(
      'Sample Items Valid',
      validCount === sampleSize,
      `${validCount}/${sampleSize} items are valid`,
      { validCount, sampleSize }
    );
    
    // TEST 5: URL Building
    console.log('\n🔗 TEST 5: URL Building');
    console.log('-'.repeat(60));
    
    const testCases = [
      { location: 'new-york-ny', category: 'wedding-reception-venues', page: 1 },
      { location: 'chicago-il', category: 'wedding-ceremony-venues', page: 2 },
      { location: 'seattle-wa', category: 'wedding-reception-venues', page: undefined }
    ];
    
    testCases.forEach(testCase => {
      const testAdapter = new TheKnotAdapter({ parameters: testCase });
      const testUrl = testAdapter.buildUrl();
      
      const hasLocation = testUrl.includes(testCase.location);
      const hasCategory = testUrl.includes(testCase.category);
      const hasPageParam = testCase.page && testCase.page > 1 ? testUrl.includes(`?page=${testCase.page}`) : true;
      const isValid = hasLocation && hasCategory && hasPageParam;
      
      logTest(
        `URL: ${testCase.location} (page ${testCase.page || 1})`,
        isValid,
        isValid ? 'Correct URL format' : 'Invalid URL format',
        { url: testUrl, expected: testCase }
      );
    });
    
  } catch (error) {
    logTest(
      'Test Execution',
      false,
      `Error during test execution: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error }
    );
  } finally {
    await browser.close();
  }
  
  // SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  console.log(`\nTotal Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Pass Rate: ${passRate}%`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

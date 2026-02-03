/**
 * Final validation test for Salvatore's Wedding Venue enrichment
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { TheKnotAdapter } from '../adapters/theknot-adapter';

playwrightChromium.use(stealth());

async function testSalvatoreEnrichment() {
  console.log('🧪 Final Validation: Salvatore\'s Wedding Venue Enrichment\n');
  console.log('='.repeat(70));

  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await browser.newPage();
  const venueUrl = 'https://www.theknot.com/marketplace/salvatores-wedding-venue-chicago-il-875255';

  try {
    console.log(`\n📍 Navigating to: ${venueUrl}\n`);
    
    // Use the adapter's extractDetailedData method
    const adapter = new TheKnotAdapter({ parameters: {} });
    const details = await adapter.extractDetailedData(page, venueUrl);

    console.log('\n' + '='.repeat(70));
    console.log('🎯 EXTRACTED DATA:');
    console.log('='.repeat(70));
    console.log(JSON.stringify(details, null, 2));
    console.log('='.repeat(70));

    // Validation
    console.log('\n✅ VALIDATION RESULTS:\n');
    
    const checks = [
      { field: 'website', expected: 'salvatores-chicago.com', value: details.website },
      { field: 'phone', expected: '773', value: details.phone },
      { field: 'facebook', expected: 'facebook.com/salvatoreschicago', value: details.facebook },
      { field: 'instagram', expected: 'instagram.com', value: details.instagram },
    ];

    let passed = 0;
    let failed = 0;

    checks.forEach(check => {
      if (check.value && check.value.includes(check.expected)) {
        console.log(`✅ ${check.field}: ${check.value}`);
        passed++;
      } else {
        console.log(`❌ ${check.field}: ${check.value || 'NOT FOUND'} (expected to contain: ${check.expected})`);
        failed++;
      }
    });

    console.log('\n' + '='.repeat(70));
    console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(70));

    if (failed === 0) {
      console.log('\n🎉 SUCCESS! All fields extracted correctly!\n');
    } else {
      console.log('\n⚠️  Some fields are missing. Check the page structure.\n');
    }

    console.log('⏸️  Browser will stay open for 15 seconds for manual inspection...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete\n');
  }
}

testSalvatoreEnrichment();

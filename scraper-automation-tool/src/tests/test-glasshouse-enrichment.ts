/**
 * Test enrichment on The Glasshouse venue page
 * URL: https://www.theknot.com/marketplace/the-glasshouse-new-york-ny-2078492
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testGlasshouseEnrichment() {
  console.log('🧪 Testing enrichment on The Glasshouse page...\n');

  const browser = await playwrightChromium.launch({
    headless: false, // Show browser to see what's happening
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  const venueUrl = 'https://www.theknot.com/marketplace/the-glasshouse-new-york-ny-2078492';

  try {
    console.log(`📍 Navigating to: ${venueUrl}`);
    await page.goto(venueUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for page to fully load

    console.log('\n🔍 Testing selectors...\n');

    // Test Website
    console.log('1. Testing Website selector...');
    const websiteSelectors = [
      'a[aria-label*="website" i]',
      'a[href*="website"]',
      'a.website-link',
      'a[title*="website" i]',
      '[class*="website"] a',
    ];

    for (const selector of websiteSelectors) {
      const element = await page.$(selector);
      if (element) {
        const href = await element.getAttribute('href');
        console.log(`   ✅ Found with: ${selector}`);
        console.log(`   → ${href}`);
        break;
      } else {
        console.log(`   ❌ Not found: ${selector}`);
      }
    }

    // Test Phone
    console.log('\n2. Testing Phone selector...');
    const phoneSelectors = [
      'a[href^="tel:"]',
      'a[aria-label*="phone" i]',
      'a[aria-label*="call" i]',
      '[class*="phone"] a',
    ];

    for (const selector of phoneSelectors) {
      const element = await page.$(selector);
      if (element) {
        const href = await element.getAttribute('href');
        console.log(`   ✅ Found with: ${selector}`);
        console.log(`   → ${href}`);
        break;
      } else {
        console.log(`   ❌ Not found: ${selector}`);
      }
    }

    // Test Facebook
    console.log('\n3. Testing Facebook selector...');
    const facebookSelectors = [
      'a[href*="facebook.com"]',
      'a[aria-label*="facebook" i]',
      '[class*="facebook"] a',
    ];

    for (const selector of facebookSelectors) {
      const element = await page.$(selector);
      if (element) {
        const href = await element.getAttribute('href');
        console.log(`   ✅ Found with: ${selector}`);
        console.log(`   → ${href}`);
        break;
      } else {
        console.log(`   ❌ Not found: ${selector}`);
      }
    }

    // Test Instagram
    console.log('\n4. Testing Instagram selector...');
    const instagramSelectors = [
      'a[href*="instagram.com"]',
      'a[aria-label*="instagram" i]',
      '[class*="instagram"] a',
    ];

    for (const selector of instagramSelectors) {
      const element = await page.$(selector);
      if (element) {
        const href = await element.getAttribute('href');
        console.log(`   ✅ Found with: ${selector}`);
        console.log(`   → ${href}`);
        break;
      } else {
        console.log(`   ❌ Not found: ${selector}`);
      }
    }

    // Test Pinterest
    console.log('\n5. Testing Pinterest selector...');
    const pinterestSelectors = [
      'a[href*="pinterest.com"]',
      'a[aria-label*="pinterest" i]',
      '[class*="pinterest"] a',
    ];

    for (const selector of pinterestSelectors) {
      const element = await page.$(selector);
      if (element) {
        const href = await element.getAttribute('href');
        console.log(`   ✅ Found with: ${selector}`);
        console.log(`   → ${href}`);
        break;
      } else {
        console.log(`   ❌ Not found: ${selector}`);
      }
    }

    // Explore "About this venue" section
    console.log('\n6. Exploring "About this venue" section...');
    const aboutSection = await page.$('text=About this venue');
    if (aboutSection) {
      console.log('   ✅ Found "About this venue" section');
      
      // Get parent container
      const container = await aboutSection.evaluateHandle(el => el.closest('section, div[class*="about"]'));
      
      // Find all links in that section
      const links = await page.$$eval('a[href]', (elements) => 
        elements.map(el => ({
          href: el.getAttribute('href'),
          text: el.textContent?.trim(),
          ariaLabel: el.getAttribute('aria-label'),
          className: el.className,
        }))
      );
      
      console.log('\n   All links found on page:');
      links.forEach((link, i) => {
        if (link.href?.includes('facebook') || 
            link.href?.includes('instagram') || 
            link.href?.includes('pinterest') ||
            link.href?.includes('tel:') ||
            link.ariaLabel?.toLowerCase().includes('website')) {
          console.log(`   ${i + 1}. ${link.href}`);
          console.log(`      aria-label: ${link.ariaLabel}`);
          console.log(`      class: ${link.className}`);
          console.log('');
        }
      });
    }

    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testGlasshouseEnrichment();

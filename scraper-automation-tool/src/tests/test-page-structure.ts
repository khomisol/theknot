/**
 * Debug test to see what's actually on Salvatore's page
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function debugPageStructure() {
  console.log('🔍 Debugging Salvatore\'s Page Structure\n');

  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await browser.newPage();
  const venueUrl = 'https://www.theknot.com/marketplace/salvatores-wedding-venue-chicago-il-875255';

  try {
    console.log(`📍 Navigating to: ${venueUrl}\n`);
    await page.goto(venueUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log('⏳ Waiting 5 seconds for page to fully load...\n');
    await page.waitForTimeout(5000);

    // Check for social-links container
    console.log('🔍 Checking for social-links container...');
    const socialLinksContainer = await page.$('[class*="social-links"]');
    console.log(`   Result: ${socialLinksContainer ? '✅ FOUND' : '❌ NOT FOUND'}\n`);

    if (socialLinksContainer) {
      const className = await socialLinksContainer.getAttribute('class');
      console.log(`   Class name: ${className}\n`);
    }

    // Check for all divs with "social" in class name
    console.log('🔍 Checking for any elements with "social" in class...');
    const socialElements = await page.$$('[class*="social"]');
    console.log(`   Found ${socialElements.length} elements\n`);

    if (socialElements.length > 0) {
      for (let i = 0; i < Math.min(socialElements.length, 5); i++) {
        const className = await socialElements[i].getAttribute('class');
        const tagName = await socialElements[i].evaluate(el => el.tagName);
        console.log(`   ${i + 1}. <${tagName}> class="${className}"`);
      }
      console.log('');
    }

    // Check for all links on the page
    console.log('🔍 Checking for all links on the page...');
    const allLinks = await page.$$('a[href]');
    console.log(`   Found ${allLinks.length} total links\n`);

    // Check for specific link types
    console.log('🔍 Checking for specific link types...');
    
    const facebookLinks = await page.$$('a[href*="facebook.com"]');
    console.log(`   Facebook links: ${facebookLinks.length}`);
    if (facebookLinks.length > 0) {
      for (const link of facebookLinks.slice(0, 3)) {
        const href = await link.getAttribute('href');
        console.log(`      - ${href}`);
      }
    }

    const instagramLinks = await page.$$('a[href*="instagram.com"]');
    console.log(`   Instagram links: ${instagramLinks.length}`);
    if (instagramLinks.length > 0) {
      for (const link of instagramLinks.slice(0, 3)) {
        const href = await link.getAttribute('href');
        console.log(`      - ${href}`);
      }
    }

    const telLinks = await page.$$('a[href^="tel:"]');
    console.log(`   Phone links: ${telLinks.length}`);
    if (telLinks.length > 0) {
      for (const link of telLinks.slice(0, 3)) {
        const href = await link.getAttribute('href');
        console.log(`      - ${href}`);
      }
    }

    const httpLinks = await page.$$('a[href^="http"]');
    console.log(`   HTTP links: ${httpLinks.length}`);
    console.log('');

    // Check for elements with "link" in class name
    console.log('🔍 Checking for elements with "link" in class...');
    const linkElements = await page.$$('[class*="link"]');
    console.log(`   Found ${linkElements.length} elements\n`);

    // Get page HTML to inspect
    console.log('🔍 Searching for "social-links" in page HTML...');
    const pageHTML = await page.content();
    const hasSocialLinks = pageHTML.includes('social-links');
    console.log(`   Result: ${hasSocialLinks ? '✅ FOUND in HTML' : '❌ NOT FOUND in HTML'}\n`);

    if (hasSocialLinks) {
      // Extract the section with social-links
      const match = pageHTML.match(/<div[^>]*social-links[^>]*>[\s\S]{0,500}/);
      if (match) {
        console.log('📄 HTML snippet with social-links:');
        console.log(match[0].substring(0, 300) + '...\n');
      }
    }

    console.log('⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Debug complete\n');
  }
}

debugPageStructure();

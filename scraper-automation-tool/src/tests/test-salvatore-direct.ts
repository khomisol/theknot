/**
 * Direct test of Salvatore's with the exact HTML structure you provided
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testSalvatoreDirect() {
  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const venueUrl = 'https://www.theknot.com/marketplace/salvatores-wedding-venue-chicago-il-925525';
  const page = await browser.newPage();

  try {
    console.log(`📍 Navigating to: ${venueUrl}`);
    await page.goto(venueUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check final URL
    const finalUrl = page.url();
    console.log(`\nFinal URL: ${finalUrl}`);
    
    if (finalUrl !== venueUrl) {
      console.log('⚠️  WARNING: Page redirected!');
    }

    // Check for social-links container
    console.log('\n🔍 Checking for social-links container...\n');
    
    const socialLinksContainer = await page.$('[class*="social-links"]');
    console.log(`social-links container: ${socialLinksContainer ? '✅ FOUND' : '❌ NOT FOUND'}`);

    if (socialLinksContainer) {
      // Get all links within it
      const links = await page.$$eval('[class*="social-links"] a[href]', (elements) =>
        elements.map((el) => ({
          href: el.getAttribute('href') || '',
          title: el.getAttribute('title') || '',
        }))
      );

      console.log(`\nFound ${links.length} links in social-links container:\n`);
      links.forEach((link, i) => {
        console.log(`${i + 1}. ${link.href}`);
        console.log(`   Title: "${link.title}"`);
      });

      // Extract
      const details: any = {};
      links.forEach((link) => {
        if (link.href.includes('facebook.com')) {
          details.facebook = link.href;
        } else if (link.href.includes('instagram.com')) {
          details.instagram = link.href;
        } else if (link.href.startsWith('http') && 
                   !link.href.includes('theknot.com') &&
                   !link.href.includes('facebook.com') &&
                   !link.href.includes('instagram.com')) {
          details.website = link.href;
        }
      });

      console.log('\n🎯 Extracted:');
      console.log(JSON.stringify(details, null, 2));
    }

    // Check page title
    const title = await page.title();
    console.log(`\nPage title: ${title}`);

    console.log('\n⏸️  Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testSalvatoreDirect();

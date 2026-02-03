/**
 * Full page analysis for Salvatore's and Pazzo's
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function analyzeVenuePage() {
  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const venueUrl = 'https://www.theknot.com/marketplace/salvatores-wedding-venue-chicago-il-925525';

  const page = await browser.newPage();

  try {
    console.log(`📍 Navigating to: ${venueUrl}`);
    await page.goto(venueUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Check if "About this venue" section exists
    const aboutSection = await page.$('text=About this venue');
    console.log(`\n"About this venue" section: ${aboutSection ? '✅ Found' : '❌ Not found'}`);

    // Check for any contact-related elements
    console.log('\n🔍 Looking for contact elements...\n');

    // Phone
    const phoneLinks = await page.$$('a[href^="tel:"]');
    console.log(`Phone links found: ${phoneLinks.length}`);
    if (phoneLinks.length > 0) {
      for (const link of phoneLinks) {
        const href = await link.getAttribute('href');
        console.log(`  → ${href}`);
      }
    }

    // Email
    const emailLinks = await page.$$('a[href^="mailto:"]');
    console.log(`\nEmail links found: ${emailLinks.length}`);
    if (emailLinks.length > 0) {
      for (const link of emailLinks) {
        const href = await link.getAttribute('href');
        console.log(`  → ${href}`);
      }
    }

    // All external links
    console.log('\n🌐 All external HTTP links:\n');
    const allLinks = await page.$$eval('a[href^="http"]', (elements) =>
      elements.map((el) => ({
        href: el.getAttribute('href'),
        text: el.textContent?.trim().substring(0, 50),
        className: el.className,
      }))
    );

    const uniqueLinks = [...new Map(allLinks.map(link => [link.href, link])).values()];
    
    uniqueLinks.slice(0, 20).forEach((link, i) => {
      if (link.href && !link.href.includes('theknot.com')) {
        console.log(`${i + 1}. ${link.href}`);
        console.log(`   Text: "${link.text}"`);
        console.log('');
      }
    });

    // Check page structure
    console.log('\n📋 Page structure analysis:\n');
    
    const hasVendorCard = await page.$('[data-testid="vendor-card"]');
    console.log(`Vendor card: ${hasVendorCard ? '✅ Found' : '❌ Not found'}`);
    
    const hasSocialLinks = await page.$('[class*="social"]');
    console.log(`Social links container: ${hasSocialLinks ? '✅ Found' : '❌ Not found'}`);
    
    const hasContactSection = await page.$('text=Contact');
    console.log(`Contact section: ${hasContactSection ? '✅ Found' : '❌ Not found'}`);

    // Get page title
    const title = await page.title();
    console.log(`\nPage title: ${title}`);

    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

analyzeVenuePage();

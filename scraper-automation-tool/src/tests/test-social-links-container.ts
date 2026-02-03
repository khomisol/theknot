/**
 * Test extraction from the social-links container
 * Target: <div class="social-links--mp-rrQYH">
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testSocialLinksContainer() {
  console.log('🧪 Testing social-links container extraction...\n');

  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = await browser.newPage();
  const venueUrl = 'https://www.theknot.com/marketplace/the-glasshouse-new-york-ny-2078492';

  try {
    console.log(`📍 Navigating to: ${venueUrl}`);
    await page.goto(venueUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log('\n🔍 Looking for social-links container...\n');

    // Find the social-links container
    const socialLinksContainer = await page.$('[class*="social-links"]');
    
    if (!socialLinksContainer) {
      console.log('❌ Could not find social-links container');
      return;
    }

    console.log('✅ Found social-links container!');

    // Extract all links within this container
    const linksInContainer = await page.$$eval('[class*="social-links"] a[href]', (elements) =>
      elements.map((el) => ({
        href: el.getAttribute('href') || '',
        text: el.textContent?.trim() || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        className: el.className || '',
        title: el.getAttribute('title') || '',
      }))
    );

    console.log('\n📋 All links in social-links container:\n');
    linksInContainer.forEach((link, i) => {
      console.log(`${i + 1}. ${link.href}`);
      console.log(`   Text: "${link.text}"`);
      console.log(`   Aria-label: "${link.ariaLabel}"`);
      console.log(`   Title: "${link.title}"`);
      console.log(`   Class: ${link.className}`);
      console.log('');
    });

    // Categorize the links
    console.log('\n🎯 Categorized extraction:\n');

    const details: any = {};

    linksInContainer.forEach((link) => {
      if (link.href.startsWith('tel:')) {
        details.phone = link.href.replace('tel:', '').trim();
        console.log(`📞 Phone: ${details.phone}`);
      } else if (link.href.startsWith('mailto:')) {
        details.email = link.href.replace('mailto:', '').trim();
        console.log(`📧 Email: ${details.email}`);
      } else if (link.href.includes('facebook.com') && !link.href.includes('facebook.com/theknot')) {
        details.facebook = link.href;
        console.log(`📘 Facebook: ${details.facebook}`);
      } else if (link.href.includes('instagram.com') && !link.href.includes('instagram.com/theknot')) {
        details.instagram = link.href;
        console.log(`📷 Instagram: ${details.instagram}`);
      } else if (link.href.includes('pinterest.com') && !link.href.includes('pinterest.com/theknot')) {
        details.pinterest = link.href;
        console.log(`📌 Pinterest: ${details.pinterest}`);
      } else if ((link.href.includes('twitter.com') || link.href.includes('x.com')) && 
                 !link.href.includes('twitter.com/theknot') && !link.href.includes('x.com/theknot')) {
        details.twitter = link.href;
        console.log(`🐦 Twitter: ${details.twitter}`);
      } else if (link.href.startsWith('http') && 
                 !link.href.includes('theknot.com') &&
                 !link.href.includes('facebook.com') &&
                 !link.href.includes('instagram.com') &&
                 !link.href.includes('pinterest.com') &&
                 !link.href.includes('twitter.com') &&
                 !link.href.includes('google.com')) {
        details.website = link.href;
        console.log(`🌐 Website: ${details.website}`);
      }
    });

    console.log('\n\n📦 Final extracted details:');
    console.log(JSON.stringify(details, null, 2));

    console.log('\n⏸️  Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testSocialLinksContainer();

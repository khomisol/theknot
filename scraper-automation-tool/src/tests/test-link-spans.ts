/**
 * Test extraction from link--mp-C2SOZ spans
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testLinkSpans() {
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

    console.log('\n🔍 Looking for link--mp- spans...\n');

    const linkSpans = await page.$$('[class*="link--mp-"]');
    console.log(`Found ${linkSpans.length} link spans`);

    // Get parent links of these spans
    const linksFromSpans = await page.$$eval('[class*="link--mp-"]', (elements) => {
      const links: any[] = [];
      elements.forEach((el) => {
        // Get parent anchor tag
        const parent = el.closest('a');
        if (parent) {
          links.push({
            href: parent.getAttribute('href') || '',
            text: el.textContent?.trim() || '',
            title: parent.getAttribute('title') || '',
            spanClass: el.className,
          });
        }
      });
      return links;
    });

    console.log(`\n📋 Extracted ${linksFromSpans.length} links from spans:\n`);

    linksFromSpans.forEach((link, i) => {
      console.log(`${i + 1}. ${link.href}`);
      console.log(`   Text: "${link.text}"`);
      console.log(`   Title: "${link.title}"`);
      console.log(`   Span class: ${link.spanClass}`);
      
      // Categorize
      if (link.href.startsWith('tel:')) {
        console.log(`   → 📞 PHONE`);
      } else if (link.href.includes('facebook.com')) {
        console.log(`   → 📘 FACEBOOK`);
      } else if (link.href.includes('instagram.com')) {
        console.log(`   → 📷 INSTAGRAM`);
      } else if (link.href.startsWith('http') && !link.href.includes('theknot.com')) {
        console.log(`   → 🌐 WEBSITE`);
      }
      console.log('');
    });

    // Extract using our logic
    console.log('\n🎯 Extracted data:\n');
    const details: any = {};

    linksFromSpans.forEach((link) => {
      if (link.href.startsWith('tel:')) {
        details.phone = link.href.replace('tel:', '').trim();
      } else if (link.href.includes('facebook.com') && !link.href.includes('facebook.com/theknot')) {
        details.facebook = link.href;
      } else if (link.href.includes('instagram.com') && !link.href.includes('instagram.com/theknot')) {
        details.instagram = link.href;
      } else if (link.href.startsWith('http') && 
                 !link.href.includes('theknot.com') &&
                 !link.href.includes('facebook.com') &&
                 !link.href.includes('instagram.com')) {
        details.website = link.href;
      }
    });

    console.log(JSON.stringify(details, null, 2));

    console.log('\n⏸️  Browser will stay open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testLinkSpans();

/**
 * Test specific venues: Salvatore's Wedding Venue and Pazzo's at 311
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testSpecificVenues() {
  console.log('🧪 Testing Salvatore\'s and Pazzo\'s venues...\n');

  const browser = await playwrightChromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const venues = [
    {
      name: "Salvatore's Wedding Venue",
      url: 'https://www.theknot.com/marketplace/salvatores-wedding-venue-chicago-il-925525'
    },
    {
      name: "Pazzo's at 311",
      url: 'https://www.theknot.com/marketplace/pazzos-at-311-chicago-il-452199'
    }
  ];

  for (const venue of venues) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${venue.name}`);
    console.log(`URL: ${venue.url}`);
    console.log('='.repeat(60));

    const page = await browser.newPage();

    try {
      console.log('\n📍 Navigating to venue page...');
      await page.goto(venue.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      // Check for social-links container
      const socialLinksContainer = await page.$('[class*="social-links"]');
      
      if (socialLinksContainer) {
        console.log('✅ Found social-links container');
        
        // Get all links in the container
        const links = await page.$$eval('[class*="social-links"] a[href]', (elements) =>
          elements.map((el) => ({
            href: el.getAttribute('href') || '',
            text: el.textContent?.trim() || '',
            title: el.getAttribute('title') || '',
          }))
        );

        console.log(`\n📋 Found ${links.length} links in social-links container:\n`);
        
        links.forEach((link, i) => {
          console.log(`${i + 1}. ${link.href}`);
          console.log(`   Title: "${link.title}"`);
          console.log(`   Text: "${link.text}"`);
          
          // Categorize
          if (link.href.startsWith('tel:')) {
            console.log(`   → 📞 PHONE`);
          } else if (link.href.includes('facebook.com')) {
            console.log(`   → 📘 FACEBOOK`);
          } else if (link.href.includes('instagram.com')) {
            console.log(`   → 📷 INSTAGRAM`);
          } else if (link.href.includes('pinterest.com')) {
            console.log(`   → 📌 PINTEREST`);
          } else if (link.href.includes('twitter.com') || link.href.includes('x.com')) {
            console.log(`   → 🐦 TWITTER/X`);
          } else if (link.href.startsWith('http') && !link.href.includes('theknot.com')) {
            console.log(`   → 🌐 WEBSITE (POTENTIAL)`);
          } else if (link.href.startsWith('#')) {
            console.log(`   → 🔗 INTERNAL LINK`);
          } else {
            console.log(`   → ❓ OTHER`);
          }
          console.log('');
        });

        // Extract using our logic
        console.log('\n🎯 Extracted data using our logic:\n');
        const extracted: any = {};

        links.forEach((link) => {
          if (link.href.startsWith('tel:')) {
            extracted.phone = link.href.replace('tel:', '').trim();
          } else if (link.href.startsWith('mailto:')) {
            extracted.email = link.href.replace('mailto:', '').trim();
          } else if (link.href.includes('facebook.com') && !link.href.includes('facebook.com/theknot')) {
            extracted.facebook = link.href;
          } else if (link.href.includes('instagram.com') && !link.href.includes('instagram.com/theknot')) {
            extracted.instagram = link.href;
          } else if (link.href.includes('pinterest.com') && !link.href.includes('pinterest.com/theknot')) {
            extracted.pinterest = link.href;
          } else if ((link.href.includes('twitter.com') || link.href.includes('x.com')) && 
                     !link.href.includes('twitter.com/theknot') && !link.href.includes('x.com/theknot')) {
            extracted.twitter = link.href;
          } else if (link.href.startsWith('http') && 
                     !link.href.includes('theknot.com') &&
                     !link.href.includes('facebook.com') &&
                     !link.href.includes('instagram.com') &&
                     !link.href.includes('pinterest.com') &&
                     !link.href.includes('twitter.com') &&
                     !link.href.includes('google.com') &&
                     !link.href.includes('maps.google')) {
            extracted.website = link.href;
          }
        });

        console.log(JSON.stringify(extracted, null, 2));

        if (!extracted.website) {
          console.log('\n⚠️  WARNING: No website found!');
          console.log('Checking if there are any external links on the page...\n');
          
          // Check all links on the page
          const allLinks = await page.$$eval('a[href^="http"]', (elements) =>
            elements.map((el) => ({
              href: el.getAttribute('href'),
              text: el.textContent?.trim(),
            }))
          );

          const externalLinks = allLinks.filter(link => 
            link.href && 
            !link.href.includes('theknot.com') &&
            !link.href.includes('facebook.com') &&
            !link.href.includes('instagram.com') &&
            !link.href.includes('pinterest.com') &&
            !link.href.includes('twitter.com') &&
            !link.href.includes('google.com') &&
            !link.href.includes('theknotww.com') &&
            !link.href.includes('partners.engine.com')
          );

          if (externalLinks.length > 0) {
            console.log('Found external links on page:');
            externalLinks.slice(0, 5).forEach((link, i) => {
              console.log(`${i + 1}. ${link.href}`);
              console.log(`   Text: "${link.text}"`);
            });
          } else {
            console.log('❌ No external links found - venue may not have a website listed');
          }
        }

      } else {
        console.log('❌ Social-links container not found');
      }

      console.log('\n⏸️  Pausing for 5 seconds...');
      await page.waitForTimeout(5000);

    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n✅ Test complete');
}

testSpecificVenues();

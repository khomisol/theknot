/**
 * Test to find the correct website selector for The Glasshouse
 */

import { chromium as playwrightChromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

playwrightChromium.use(stealth());

async function testWebsiteSelector() {
  console.log('🧪 Testing website selector on The Glasshouse page...\n');

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

    console.log('\n🔍 Looking for website link in "About this venue" section...\n');

    // Find the "About this venue" section
    const aboutSection = await page.$('text=About this venue');
    if (!aboutSection) {
      console.log('❌ Could not find "About this venue" section');
      return;
    }

    console.log('✅ Found "About this venue" section');

    // Get the parent container
    const container = await aboutSection.evaluateHandle((el) => {
      let parent = el.parentElement;
      while (parent && !parent.className.includes('about')) {
        parent = parent.parentElement;
      }
      return parent || el.parentElement;
    });

    // Look for span elements with class containing "span-link"
    const spanLinks = await page.$$eval('[class*="span-link"]', (elements) =>
      elements.map((el) => ({
        text: el.textContent?.trim(),
        className: el.className,
        href: el.getAttribute('href'),
        parentHref: el.parentElement?.getAttribute('href'),
      }))
    );

    console.log('\n📋 Found span-link elements:');
    spanLinks.forEach((link, i) => {
      console.log(`\n${i + 1}. Text: "${link.text}"`);
      console.log(`   Class: ${link.className}`);
      console.log(`   Href: ${link.href || 'none'}`);
      console.log(`   Parent Href: ${link.parentHref || 'none'}`);
    });

    // Try to find website link specifically
    console.log('\n\n🎯 Trying specific selectors for website...\n');

    const selectors = [
      '[class*="span-link--mp-CEZDE"]',
      'span[class*="span-link"]',
      '.span-link--mp-CEZDE',
    ];

    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        const text = await element.textContent();
        const parent = await element.evaluateHandle((el) => el.parentElement);
        const parentHref = await parent.evaluate((el) => el?.getAttribute('href'));
        
        console.log(`✅ Selector: ${selector}`);
        console.log(`   Text: "${text?.trim()}"`);
        console.log(`   Parent href: ${parentHref}`);
        
        if (parentHref && !parentHref.includes('theknot.com')) {
          console.log(`   🎉 This is the venue website!`);
        }
      } else {
        console.log(`❌ Selector not found: ${selector}`);
      }
    }

    // Alternative: Look for links in the About section that are external
    console.log('\n\n🔗 All external links in About section:\n');
    const allLinks = await page.$$eval('a[href^="http"]', (elements) =>
      elements.map((el) => ({
        href: el.getAttribute('href'),
        text: el.textContent?.trim(),
        className: el.className,
      }))
    );

    const externalLinks = allLinks.filter(
      (link) =>
        link.href &&
        !link.href.includes('theknot.com') &&
        !link.href.includes('facebook.com') &&
        !link.href.includes('instagram.com') &&
        !link.href.includes('pinterest.com') &&
        !link.href.includes('twitter.com')
    );

    externalLinks.forEach((link, i) => {
      console.log(`${i + 1}. ${link.href}`);
      console.log(`   Text: "${link.text}"`);
      console.log(`   Class: ${link.className}`);
      console.log('');
    });

    console.log('\n⏸️  Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete');
  }
}

testWebsiteSelector();

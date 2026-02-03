import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function findVenueName() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca');
  await page.waitForSelector('[data-testid="vendor-card-base"]', { timeout: 10000 });
  
  // Find all possible name locations
  const nameInfo = await page.$$eval('[data-testid="vendor-card-base"]', (cards) => {
    if (cards.length === 0) return [];
    
    return cards.slice(0, 3).map((card, index) => {
      // Try different selectors
      const ariaLabelledBy = card.getAttribute('aria-labelledby');
      const labelElement = ariaLabelledBy ? document.getElementById(ariaLabelledBy) : null;
      
      const h2 = card.querySelector('h2');
      const h3 = card.querySelector('h3');
      const heading = card.querySelector('[class*="heading"], [class*="title"], [class*="name"]');
      const allLinks = Array.from(card.querySelectorAll('a')).map(a => ({
        href: a.getAttribute('href'),
        text: a.textContent?.trim().substring(0, 100)
      }));
      
      return {
        index,
        ariaLabelledBy,
        labelText: labelElement?.textContent?.trim(),
        h2Text: h2?.textContent?.trim(),
        h3Text: h3?.textContent?.trim(),
        headingText: heading?.textContent?.trim(),
        allLinks
      };
    });
  });
  
  console.log('Venue Name Locations:');
  console.log(JSON.stringify(nameInfo, null, 2));
  
  await browser.close();
}

findVenueName();

import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function debugHTML() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca');
  await page.waitForSelector('[data-testid="vendor-card-base"]', { timeout: 10000 });
  
  // Get HTML structure of first card
  const cardHTML = await page.$$eval('[data-testid="vendor-card-base"]', (cards) => {
    if (cards.length === 0) return 'No cards found';
    
    const card = cards[0];
    return {
      outerHTML: card.outerHTML.substring(0, 2000),
      nameLink: card.querySelector('a[href*="/marketplace/"]')?.outerHTML.substring(0, 500),
      allText: card.textContent?.substring(0, 500)
    };
  });
  
  console.log('Card HTML Structure:');
  console.log(JSON.stringify(cardHTML, null, 2));
  
  await browser.close();
}

debugHTML();

import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function debugVenues() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.theknot.com/marketplace/wedding-reception-venues-new-york-ny');
  await page.waitForSelector('[data-testid="vendor-card-base"]', { timeout: 10000 });
  
  // Find Rampoldi and JW Marriott cards
  const venueInfo = await page.$$eval('[data-testid="vendor-card-base"]', (cards) => {
    const results: any[] = [];
    
    cards.forEach((card, index) => {
      const ariaLabelledBy = card.getAttribute('aria-labelledby');
      let name = '';
      if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        name = labelElement?.textContent?.trim() || '';
      }
      
      // Only check Rampoldi and JW Marriott
      if (name.includes('Rampoldi') || name.includes('Marriott Essex')) {
        // Get all text content
        const allText = card.textContent || '';
        
        // Get location elements
        const locationElements = Array.from(card.querySelectorAll('[class*="location"], [class*="address"]'));
        const locations = locationElements.map(el => ({
          class: el.className,
          text: el.textContent?.trim()
        }));
        
        // Get rating/review elements
        const ratingElements = Array.from(card.querySelectorAll('[class*="rating"], [class*="star"], [class*="review"]'));
        const ratings = ratingElements.map(el => ({
          class: el.className,
          text: el.textContent?.trim()
        }));
        
        // Check for "New" badge
        const newBadge = card.querySelector('[class*="new"], [aria-label*="New"], [class*="badge"]');
        const hasNewBadge = newBadge ? {
          class: newBadge.className,
          text: newBadge.textContent?.trim(),
          ariaLabel: newBadge.getAttribute('aria-label')
        } : null;
        
        results.push({
          index,
          name,
          locations,
          ratings,
          hasNewBadge,
          allTextSample: allText.substring(0, 300)
        });
      }
    });
    
    return results;
  });
  
  console.log('Venue Debug Info:');
  console.log(JSON.stringify(venueInfo, null, 2));
  
  await browser.close();
}

debugVenues();

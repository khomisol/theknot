/**
 * Test script to validate extraction logic for ALL venues on a page
 * Specifically checking for blank ratings and locations
 */

import { chromium } from 'playwright';

async function testAllVenuesExtraction() {
  console.log('=== Testing All Venues Extraction ===\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to New York wedding venues
    const url = 'https://www.theknot.com/marketplace/wedding-reception-venues-new-york-ny';
    console.log(`Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for venue cards to load
    await page.waitForSelector('[data-testid="vendor-card-base"]', { timeout: 10000 });
    await page.waitForTimeout(3000); // Extra wait for dynamic content

    // Extract ALL venues using the same logic as the adapter
    const venues = await page.$$eval('[data-testid="vendor-card-base"]', (cards) => {
      return cards.map((card, index) => {
        // Extract name
        let name = '';
        const ariaLabelledBy = card.getAttribute('aria-labelledby');
        if (ariaLabelledBy) {
          const labelElement = document.getElementById(ariaLabelledBy);
          if (labelElement) {
            name = labelElement.textContent?.trim() || '';
          }
        }

        // Extract location
        const locationElements = card.querySelectorAll('[class*="location"], [class*="address"]');
        let location = '';
        let locationDebug: string[] = [];
        
        for (const el of locationElements) {
          const text = el.textContent?.trim() || '';
          locationDebug.push(`"${text}"`);
          
          let cleanText = text.replace(/Location:/gi, '').trim();
          
          // Pattern 1: "City, ST"
          let locationMatch = cleanText.match(/([A-Za-z\s]+),\s*([A-Z]{2})/);
          if (locationMatch) {
            const city = locationMatch[1].trim();
            const state = locationMatch[2];
            location = `${city}, ${state}`;
            break;
          }
          
          // Pattern 2: Duplicated text
          if (cleanText.length > 0 && !location) {
            const halfLength = Math.floor(cleanText.length / 2);
            const firstHalf = cleanText.substring(0, halfLength);
            const secondHalf = cleanText.substring(halfLength);
            
            if (firstHalf === secondHalf) {
              location = firstHalf;
              break;
            }
            
            if (cleanText.length > 3) {
              location = cleanText;
              break;
            }
          }
        }

        // Extract rating
        let rating: number | string | undefined;
        let ratingDebug: string[] = [];
        
        // Check for "New" badge
        const allElements = card.querySelectorAll('*');
        let foundNewBadge = false;
        
        for (const el of allElements) {
          const className = el.className || '';
          const text = el.textContent?.trim() || '';
          
          if ((className.includes('badge') || className.includes('new') || className.includes('review')) && 
              text === 'New') {
            rating = 'New';
            foundNewBadge = true;
            ratingDebug.push(`Found "New" badge in element with class: ${className}`);
            break;
          }
        }
        
        // If not new, extract rating
        if (!foundNewBadge) {
          const ratingElements = card.querySelectorAll('[class*="rating"], [class*="star"]');
          for (const el of ratingElements) {
            const text = el.textContent || '';
            ratingDebug.push(`Rating element text: "${text}"`);
            
            const ratingMatch = text.match(/([\d.]+)/);
            if (ratingMatch) {
              const ratingValue = parseFloat(ratingMatch[1]);
              if (ratingValue > 0) {
                rating = ratingValue;
              } else if (ratingValue === 0) {
                rating = 0;
              }
              break;
            }
          }
        }

        // Extract reviews
        let reviews: number | undefined;
        const reviewElements = card.querySelectorAll('[class*="review"]');
        for (const el of reviewElements) {
          const text = el.textContent || '';
          const reviewMatch = text.match(/\((\d+)\)|(\d+)\s*Reviews?/i);
          if (reviewMatch) {
            reviews = parseInt(reviewMatch[1] || reviewMatch[2]);
            break;
          }
        }

        return {
          index: index + 1,
          name,
          location,
          locationDebug,
          rating,
          ratingDebug,
          reviews,
          hasIssue: !location || rating === undefined
        };
      });
    });

    // Report results
    console.log(`\n=== EXTRACTION RESULTS (${venues.length} venues) ===\n`);
    
    let issueCount = 0;
    venues.forEach((venue) => {
      if (venue.hasIssue) {
        issueCount++;
        console.log(`\n❌ ISSUE #${issueCount} - Venue #${venue.index}: ${venue.name || 'NO NAME'}`);
        console.log(`   Location: ${venue.location || 'BLANK'}`);
        console.log(`   Location Debug: ${venue.locationDebug.join(', ')}`);
        console.log(`   Rating: ${venue.rating !== undefined ? venue.rating : 'BLANK'}`);
        console.log(`   Rating Debug: ${venue.ratingDebug.join(', ')}`);
        console.log(`   Reviews: ${venue.reviews || 'BLANK'}`);
      } else {
        console.log(`✅ Venue #${venue.index}: ${venue.name} | ${venue.location} | ${venue.rating} | ${venue.reviews || 0} reviews`);
      }
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total venues: ${venues.length}`);
    console.log(`Venues with issues: ${issueCount}`);
    console.log(`Success rate: ${((venues.length - issueCount) / venues.length * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testAllVenuesExtraction();

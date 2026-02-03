import type { Page } from 'playwright';
import { BaseSiteAdapter } from './base-adapter';
import type { ScrapedItem } from '../types/worker';

export class TheKnotAdapter extends BaseSiteAdapter {
  /**
   * TheKnot Rate Limiting (Story 2.5)
   *
   * Strategy: 2-4 second delays between page navigations
   * Rationale:
   * - Respectful scraping (don't overload servers)
   * - Avoid bot detection
   * - Random delays mimic human behavior
   */
  getRateLimit(): { min: number; max: number } {
    return { min: 2000, max: 4000 }; // 2-4 seconds
  }

  buildUrl(): string {
    const { location, category, page } = this.config.parameters;

    /**
     * TheKnot URL Structure (researched 2026-01-25):
     *
     * Pattern: https://www.theknot.com/marketplace/{category}-{location}
     *
     * Examples:
     * - https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa
     * - https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca
     * - https://www.theknot.com/marketplace/wedding-ceremony-venues-new-york-ny
     *
     * Pagination: Uses query parameter ?page={page}
     * - Page 1: No parameter (default)
     * - Page 2+: ?page=2, ?page=3, etc.
     *
     * Location Format: city-state (e.g., "seattle-wa", "los-angeles-ca")
     * Category Format: kebab-case (e.g., "wedding-reception-venues")
     */

    // Default values
    const defaultCategory = 'wedding-reception-venues';
    const defaultLocation = 'seattle-wa';

    // Use provided values or defaults
    const categorySlug = category || defaultCategory;
    const locationSlug = location || defaultLocation;

    // Build base URL: marketplace/{category}-{location}
    let url = `https://www.theknot.com/marketplace/${categorySlug}-${locationSlug}`;

    // Add pagination if page > 1
    if (page && page > 1) {
      url += `?page=${page}`;
    }

    return url;
  }

  async extractData(page: Page): Promise<ScrapedItem[]> {
    /**
     * TheKnot Data Extraction (Story 2.2 + 2.3)
     *
     * Selectors discovered (2026-01-25):
     * - Venue cards: [data-testid="vendor-card-base"]
     * - Venue name: Via aria-labelledby attribute
     * - Location: [data-testid*="location"]
     * - URL: a[href*="/marketplace/"]
     * - Rating + Reviews: [class*="review"] (combined as "4.1Stars(17)Reviews")
     * - Price: [class*="price"] (e.g., "Starting at $3,000")
     */

    console.log('[INFO] Extracting venue data from TheKnot page...');

    // Wait for venue cards to load
    try {
      await page.waitForSelector('[data-testid="vendor-card-base"]', {
        timeout: 10000,
      });
    } catch (error) {
      console.warn('[WARN] No venue cards found on page');
      return [];
    }

    // Get all venue cards
    const venueCards = await page.$$('[data-testid="vendor-card-base"]');
    console.log(`[INFO] Found ${venueCards.length} venue cards`);

    if (venueCards.length === 0) {
      return [];
    }

    const items: ScrapedItem[] = [];

    for (let i = 0; i < venueCards.length; i++) {
      const card = venueCards[i];

      try {
        // Extract venue name from aria-labelledby
        let name = '';
        const ariaLabelId = await card.getAttribute('aria-labelledby');
        if (ariaLabelId) {
          const labelEl = await page.$(`#${ariaLabelId}`);
          if (labelEl) {
            const labelText = await labelEl.textContent();
            name = labelText?.trim() || '';
          }
        }

        // Fallback: Extract name from URL if aria-label fails
        if (!name) {
          const linkEl = await card.$('a[href*="/marketplace/"]');
          if (linkEl) {
            const href = await linkEl.getAttribute('href');
            if (href) {
              const parts = href.split('/').pop()?.split('-');
              if (parts && parts.length > 2) {
                const nameParts = parts.slice(0, -2);
                name = nameParts
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              }
            }
          }
        }

        // Extract location
        let location = '';
        const locationEl = await card.$('[data-testid*="location"]');
        if (locationEl) {
          const locationText = await locationEl.textContent();
          // Clean up location text (remove "Location:" prefix and duplicates)
          location =
            locationText
              ?.replace(/Location:/gi, '')
              .trim()
              .split(/\s{2,}/)[0] // Take first part before multiple spaces
              .trim() || '';
        }

        // Extract rating and reviews (Story 2.3)
        // Format: "4.1Stars(17)Reviews"
        let rating: number | undefined;
        let reviews: number | undefined;
        const reviewEl = await card.$('[class*="review"]');
        if (reviewEl) {
          const reviewText = await reviewEl.textContent();
          if (reviewText) {
            // Parse rating: "4.1Stars" -> 4.1
            const ratingMatch = reviewText.match(/([\d.]+)Stars/);
            if (ratingMatch) {
              rating = parseFloat(ratingMatch[1]);
            }

            // Parse review count: "(17)" -> 17
            const reviewsMatch = reviewText.match(/\((\d+)\)/);
            if (reviewsMatch) {
              reviews = parseInt(reviewsMatch[1]);
            }
          }
        }

        // Extract price (Story 2.3)
        let price: string | undefined;
        const priceEl = await card.$('[class*="price"]');
        if (priceEl) {
          const priceText = await priceEl.textContent();
          price = priceText?.trim() || undefined;
        }

        // Extract URL
        let url = '';
        const linkEl = await card.$('a[href*="/marketplace/"]');
        if (linkEl) {
          const href = await linkEl.getAttribute('href');
          if (href) {
            // Convert relative URL to absolute
            url = href.startsWith('http')
              ? href
              : `https://www.theknot.com${href}`;
          }
        }

        // Only add item if we have at least a name and URL
        if (name && url) {
          items.push({
            name,
            location: location || undefined,
            rating,
            reviews,
            price,
            url,
          });
        } else {
          console.warn(
            `[WARN] Skipping venue ${i + 1}: missing required fields (name: ${!!name}, url: ${!!url})`
          );
        }
      } catch (error) {
        console.warn(`[WARN] Error extracting venue ${i + 1}:`, error);
        // Continue with next venue
      }
    }

    console.log(`[INFO] Successfully extracted ${items.length} venues`);
    return items;
  }

  /**
   * Get total number of pages available
   */
  async getTotalPages(page: Page): Promise<number> {
    try {
      console.log('[INFO] Detecting total number of pages...');
      
      // Wait for pagination to load
      await page.waitForTimeout(2000);
      
      // Try to find pagination elements
      const totalPages = await page.evaluate(() => {
        // Strategy 1: Look for numbered page links
        const pageLinks = Array.from(document.querySelectorAll('a[aria-label*="Go to page"], button[aria-label*="Go to page"]'));
        if (pageLinks.length > 0) {
          const pageNumbers = pageLinks.map(link => {
            const match = link.getAttribute('aria-label')?.match(/page (\d+)/i);
            return match ? parseInt(match[1]) : 0;
          });
          return Math.max(...pageNumbers);
        }
        
        // Strategy 2: Look for "Page X of Y" text
        const pageText = document.body.textContent || '';
        const pageMatch = pageText.match(/Page \d+ of (\d+)/i);
        if (pageMatch) {
          return parseInt(pageMatch[1]);
        }
        
        // Strategy 3: Look for pagination nav with numbered links
        const paginationNav = document.querySelector('nav[aria-label*="pagination"], [class*="pagination"]');
        if (paginationNav) {
          const links = Array.from(paginationNav.querySelectorAll('a, button'));
          const numbers = links.map(link => {
            const text = link.textContent?.trim() || '';
            const num = parseInt(text);
            return isNaN(num) ? 0 : num;
          }).filter(n => n > 0);
          
          if (numbers.length > 0) {
            return Math.max(...numbers);
          }
        }
        
        // Default: assume at least 1 page
        return 1;
      });
      
      console.log(`[INFO] Detected ${totalPages} total pages`);
      return totalPages;
    } catch (error) {
      console.warn('[WARN] Error detecting total pages:', error);
      return 1; // Default to 1 page
    }
  }

  async hasNextPage(page: Page): Promise<boolean> {
    /**
     * Story 2.4: Pagination Detection
     *
     * TheKnot uses pagination links with aria-label="Go to next page"
     * or "Go to page X" where X is the next page number.
     *
     * Strategy: Look for "Go to next page" link with multiple fallback selectors
     */
    try {
      // Try multiple selectors for the next page button
      const selectors = [
        'a[aria-label="Go to next page"]',
        'a[aria-label*="next"]',
        'button[aria-label="Go to next page"]',
        'button[aria-label*="next"]',
        '[data-testid*="next"]',
        '.pagination a:last-child:not(.disabled)',
        'nav[aria-label*="pagination"] a:last-child'
      ];

      for (const selector of selectors) {
        const nextLink = await page.$(selector);
        if (nextLink) {
          // Check if it's disabled
          const isDisabled = await nextLink.evaluate((el) => {
            return el.hasAttribute('disabled') || 
                   el.classList.contains('disabled') ||
                   el.getAttribute('aria-disabled') === 'true';
          });
          
          if (!isDisabled) {
            console.log(`[INFO] Found next page button with selector: ${selector}`);
            return true;
          }
        }
      }

      console.log('[INFO] No next page button found (end of results)');
      return false;
    } catch (error) {
      console.warn('[WARN] Error checking for next page:', error);
      return false;
    }
  }

  async goToNextPage(page: Page): Promise<void> {
    /**
     * Story 2.4: Pagination Navigation
     *
     * Click the "Go to next page" link and wait for new content to load.
     */
    try {
      // Try multiple selectors for the next page button
      const selectors = [
        'a[aria-label="Go to next page"]',
        'a[aria-label*="next"]',
        'button[aria-label="Go to next page"]',
        'button[aria-label*="next"]',
        '[data-testid*="next"]',
        '.pagination a:last-child:not(.disabled)',
        'nav[aria-label*="pagination"] a:last-child'
      ];

      let nextLink = null;
      let usedSelector = '';

      for (const selector of selectors) {
        nextLink = await page.$(selector);
        if (nextLink) {
          const isDisabled = await nextLink.evaluate((el) => {
            return el.hasAttribute('disabled') || 
                   el.classList.contains('disabled') ||
                   el.getAttribute('aria-disabled') === 'true';
          });
          
          if (!isDisabled) {
            usedSelector = selector;
            break;
          }
        }
      }

      if (!nextLink) {
        throw new Error('Next page link not found');
      }

      console.log(`[INFO] Navigating to next page using selector: ${usedSelector}`);

      // Get current URL to verify navigation
      const currentUrl = page.url();

      // Click the link
      await nextLink.click();

      // Wait for URL to change or venue cards to reload
      await Promise.race([
        page.waitForURL((url) => url.toString() !== currentUrl, { timeout: 15000 }),
        page.waitForSelector('[data-testid="vendor-card-base"]', { timeout: 15000 })
      ]);

      // Small delay to ensure content is stable
      await page.waitForTimeout(1000);

      console.log(`[INFO] Successfully navigated to next page: ${page.url()}`);
    } catch (error) {
      console.error('[ERROR] Failed to navigate to next page:', error);
      throw error;
    }
  }

  /**
   * Epic 7: Detail Enrichment
   * 
   * Extract detailed information from individual venue detail pages.
   * This is a two-pass approach:
   * - Pass 1: Scrape listing pages (existing extractData method)
   * - Pass 2: Enrich with details from venue pages (this method)
   * 
   * Strategy: Target the "social-links" container OR "link--mp-C2SOZ" spans
   * (TheKnot has two different page structures)
   */
  async extractDetailedData(page: Page, venueUrl: string): Promise<Partial<ScrapedItem>> {
    console.log(`[INFO] Extracting detailed data from ${venueUrl}`);

    try {
      // Navigate to venue detail page
      await page.goto(venueUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait for page to load
      await page.waitForTimeout(3000);

      // Debug: Check actual URL after navigation
      const actualUrl = page.url();
      console.log(`[INFO] Actual URL after navigation: ${actualUrl}`);
      
      if (actualUrl !== venueUrl) {
        console.log(`[WARN] URL changed! Expected: ${venueUrl}, Got: ${actualUrl}`);
      }

      const details: Partial<ScrapedItem> = {};

      // Strategy 1: Try social-links container (newer page structure)
      const socialLinksContainer = await page.$('[class*="social-links"]');
      
      if (socialLinksContainer) {
        console.log('[INFO] Found social-links container');
        
        // Get all links within the social-links container
        const linksInContainer = await page.$$eval('[class*="social-links"] a[href]', (elements) =>
          elements.map((el) => ({
            href: el.getAttribute('href') || '',
            text: el.textContent?.trim() || '',
            title: el.getAttribute('title') || '',
          }))
        );

        console.log(`[INFO] Found ${linksInContainer.length} links in social-links container`);
        this.extractFromLinks(linksInContainer, details);
      } else {
        console.log('[INFO] Social-links container not found, using fallback');
      }

      // Always check for phone numbers on the entire page
      if (!details.phone) {
        console.log('[INFO] Searching for phone on entire page...');
        const phoneLinks = await page.$$eval('a[href^="tel:"]', (elements) =>
          elements.map((el) => el.getAttribute('href') || '')
        );
        
        if (phoneLinks.length > 0) {
          details.phone = phoneLinks[0].replace('tel:', '').trim();
          console.log(`[INFO] Found phone: ${details.phone}`);
        }
      }

      // Always check for email on the entire page
      if (!details.email) {
        const emailLinks = await page.$$eval('a[href^="mailto:"]', (elements) =>
          elements.map((el) => el.getAttribute('href') || '')
        );
        
        if (emailLinks.length > 0) {
          details.email = emailLinks[0].replace('mailto:', '').trim();
          console.log(`[INFO] Found email: ${details.email}`);
        }
      }

      console.log(`[INFO] Extracted ${Object.keys(details).length} detail fields:`, details);
      return details;
    } catch (error) {
      console.error(`[ERROR] Failed to extract details from ${venueUrl}:`, error);
      return {};
    }
  }

  /**
   * Helper method to extract contact info from a list of links
   */
  private extractFromLinks(links: any[], details: Partial<ScrapedItem>): void {
    links.forEach((link) => {
      if (link.href.startsWith('tel:')) {
        details.phone = link.href.replace('tel:', '').trim();
      } else if (link.href.startsWith('mailto:')) {
        details.email = link.href.replace('mailto:', '').trim();
      } else if (link.href.includes('facebook.com') && !link.href.includes('facebook.com/theknot')) {
        details.facebook = link.href;
      } else if (link.href.includes('instagram.com') && !link.href.includes('instagram.com/theknot')) {
        details.instagram = link.href;
      } else if (link.href.includes('pinterest.com') && !link.href.includes('pinterest.com/theknot')) {
        details.pinterest = link.href;
      } else if ((link.href.includes('twitter.com') || link.href.includes('x.com')) && 
                 !link.href.includes('twitter.com/theknot') && !link.href.includes('x.com/theknot')) {
        details.twitter = link.href;
      } else if (link.href.startsWith('http') && 
                 !link.href.startsWith('https://www.theknot.com') && // Check domain, not URL params
                 !link.href.startsWith('http://www.theknot.com') &&
                 !link.href.startsWith('https://theknot.com') &&
                 !link.href.startsWith('http://theknot.com') &&
                 !link.href.includes('facebook.com') &&
                 !link.href.includes('instagram.com') &&
                 !link.href.includes('pinterest.com') &&
                 !link.href.includes('twitter.com') &&
                 !link.href.includes('google.com') &&
                 !link.href.includes('maps.google')) {
        details.website = link.href;
        details.website_clean = this.cleanUrl(link.href);
      }
    });
  }

  /**
   * Helper method to remove UTM and tracking parameters from URLs
   */
  private cleanUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove common tracking parameters
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source'];
      paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
      return urlObj.toString();
    } catch (error) {
      // If URL parsing fails, return original
      return url;
    }
  }

  /**
   * Get rate limit for detail page scraping
   * Slower than listing pages to be more respectful
   */
  getDetailRateLimit(): { min: number; max: number } {
    return { min: 3000, max: 5000 }; // 3-5 seconds (slower than listing pages)
  }
}

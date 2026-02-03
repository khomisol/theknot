/**
 * Test pagination detection for Los Angeles
 * Validate reliability across different locations
 */

import { chromium } from 'playwright';

async function testLosAngelesPagination() {
  console.log('=== Testing Los Angeles Pagination ===\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = 'https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca';
    console.log(`Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for page to load
    await page.waitForTimeout(5000);

    console.log('=== Extracting Pagination Information ===\n');

    const paginationData = await page.evaluate(() => {
      const results: any = {
        strategies: {},
        pageLinks: [],
        textPatterns: []
      };

      // Strategy 1: Look for "page X of Y" text (MOST RELIABLE)
      const bodyText = document.body.textContent || '';
      const pageOfMatch = bodyText.match(/page\s+(\d+)\s+of\s+(\d+)/i);
      if (pageOfMatch) {
        results.strategies.textPattern = {
          found: true,
          currentPage: parseInt(pageOfMatch[1]),
          totalPages: parseInt(pageOfMatch[2]),
          matchText: pageOfMatch[0]
        };
      } else {
        results.strategies.textPattern = { found: false };
      }

      // Strategy 2: Look for numbered page links
      const pageLinks = Array.from(document.querySelectorAll('a[aria-label*="Go to page"], button[aria-label*="Go to page"]'));
      if (pageLinks.length > 0) {
        const pageNumbers = pageLinks.map((link: any) => {
          const match = link.getAttribute('aria-label')?.match(/page (\d+)/i);
          return match ? parseInt(match[1]) : 0;
        }).filter(n => n > 0);
        
        results.strategies.numberedLinks = {
          found: true,
          totalLinks: pageLinks.length,
          pageNumbers: pageNumbers,
          maxPage: Math.max(...pageNumbers)
        };

        // Store link details
        pageLinks.forEach((link: any) => {
          results.pageLinks.push({
            ariaLabel: link.getAttribute('aria-label'),
            href: link.getAttribute('href'),
            text: link.textContent?.trim()
          });
        });
      } else {
        results.strategies.numberedLinks = { found: false };
      }

      // Strategy 3: Look for pagination nav with numbered links
      const paginationNav = document.querySelector('nav[aria-label*="pagination"], [class*="pagination"]');
      if (paginationNav) {
        const links = Array.from(paginationNav.querySelectorAll('a, button'));
        const numbers = links.map((link: any) => {
          const text = link.textContent?.trim() || '';
          const num = parseInt(text);
          return isNaN(num) ? 0 : num;
        }).filter(n => n > 0);

        results.strategies.paginationNav = {
          found: true,
          totalElements: links.length,
          numbers: numbers,
          maxPage: numbers.length > 0 ? Math.max(...numbers) : 0
        };
      } else {
        results.strategies.paginationNav = { found: false };
      }

      // Strategy 4: Look for "last page" link
      const lastPageLink = document.querySelector('a[aria-label*="last"], button[aria-label*="last"]');
      if (lastPageLink) {
        const href = lastPageLink.getAttribute('href');
        let lastPage = 0;
        if (href) {
          const match = href.match(/page=(\d+)/);
          if (match) {
            lastPage = parseInt(match[1]);
          }
        }
        results.strategies.lastPageLink = {
          found: true,
          href: href,
          lastPage: lastPage
        };
      } else {
        results.strategies.lastPageLink = { found: false };
      }

      // Look for other text patterns
      const patterns = [
        { name: 'X-Y of Z', regex: /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/gi },
        { name: 'Showing X-Y of Z', regex: /showing\s+(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/gi },
        { name: 'X of Y results', regex: /(\d+)\s+of\s+(\d+)\s+results/gi }
      ];

      patterns.forEach(pattern => {
        const matches = Array.from(bodyText.matchAll(pattern.regex));
        if (matches.length > 0) {
          matches.forEach(match => {
            results.textPatterns.push({
              name: pattern.name,
              match: match[0],
              groups: Array.from(match).slice(1)
            });
          });
        }
      });

      return results;
    });

    // Display results
    console.log('=== STRATEGY RESULTS ===\n');

    console.log('1. Text Pattern ("page X of Y"):');
    if (paginationData.strategies.textPattern.found) {
      console.log(`   ✅ FOUND: "${paginationData.strategies.textPattern.matchText}"`);
      console.log(`   Current Page: ${paginationData.strategies.textPattern.currentPage}`);
      console.log(`   Total Pages: ${paginationData.strategies.textPattern.totalPages}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    console.log('\n2. Numbered Page Links:');
    if (paginationData.strategies.numberedLinks.found) {
      console.log(`   ✅ FOUND: ${paginationData.strategies.numberedLinks.totalLinks} links`);
      console.log(`   Page Numbers: ${paginationData.strategies.numberedLinks.pageNumbers.join(', ')}`);
      console.log(`   Max Page: ${paginationData.strategies.numberedLinks.maxPage}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    console.log('\n3. Pagination Nav:');
    if (paginationData.strategies.paginationNav.found) {
      console.log(`   ✅ FOUND: ${paginationData.strategies.paginationNav.totalElements} elements`);
      console.log(`   Numbers: ${paginationData.strategies.paginationNav.numbers.join(', ')}`);
      console.log(`   Max Page: ${paginationData.strategies.paginationNav.maxPage}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    console.log('\n4. Last Page Link:');
    if (paginationData.strategies.lastPageLink.found) {
      console.log(`   ✅ FOUND`);
      console.log(`   Href: ${paginationData.strategies.lastPageLink.href}`);
      console.log(`   Last Page: ${paginationData.strategies.lastPageLink.lastPage}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    console.log('\n=== PAGE LINKS DETAILS ===\n');
    paginationData.pageLinks.forEach((link: any, index: number) => {
      console.log(`Link #${index + 1}:`);
      console.log(`  Aria-Label: ${link.ariaLabel}`);
      console.log(`  Text: ${link.text}`);
      console.log(`  Href: ${link.href}`);
    });

    console.log('\n=== OTHER TEXT PATTERNS ===\n');
    if (paginationData.textPatterns.length > 0) {
      paginationData.textPatterns.forEach((pattern: any, index: number) => {
        console.log(`Pattern #${index + 1} (${pattern.name}):`);
        console.log(`  Match: ${pattern.match}`);
        console.log(`  Groups: ${pattern.groups.join(', ')}`);
      });
    } else {
      console.log('No additional patterns found');
    }

    // Determine best strategy
    console.log('\n=== RECOMMENDATION ===\n');
    
    let recommendedStrategy = 'Unknown';
    let maxPages = 1;

    if (paginationData.strategies.textPattern.found) {
      recommendedStrategy = 'Text Pattern ("page X of Y")';
      maxPages = paginationData.strategies.textPattern.totalPages;
      console.log(`✅ BEST: ${recommendedStrategy}`);
      console.log(`   Reason: Most reliable, directly states total pages`);
      console.log(`   Total Pages: ${maxPages}`);
    } else if (paginationData.strategies.numberedLinks.found) {
      recommendedStrategy = 'Numbered Page Links';
      maxPages = paginationData.strategies.numberedLinks.maxPage;
      console.log(`✅ BEST: ${recommendedStrategy}`);
      console.log(`   Reason: Reliable, extracts from link aria-labels`);
      console.log(`   Total Pages: ${maxPages}`);
    } else if (paginationData.strategies.paginationNav.found && paginationData.strategies.paginationNav.maxPage > 0) {
      recommendedStrategy = 'Pagination Nav Numbers';
      maxPages = paginationData.strategies.paginationNav.maxPage;
      console.log(`✅ BEST: ${recommendedStrategy}`);
      console.log(`   Reason: Fallback, extracts from visible numbers`);
      console.log(`   Total Pages: ${maxPages}`);
    } else {
      console.log(`⚠️  No reliable pagination found, defaulting to 1 page`);
    }

    // Take screenshot
    console.log('\n=== Taking Screenshot ===\n');
    await page.evaluate(() => {
      const pagination = document.querySelector('nav[aria-label*="pagination"], [class*="pagination"]');
      if (pagination) {
        pagination.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(2000);
    
    const screenshotPath = 'data/screenshots/pagination-los-angeles.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved: ${screenshotPath}`);

    console.log('\n=== FINAL RESULT ===\n');
    console.log(`Location: Los Angeles, CA`);
    console.log(`Strategy: ${recommendedStrategy}`);
    console.log(`Total Pages: ${maxPages}`);
    console.log(`Reliability: ${paginationData.strategies.textPattern.found ? 'HIGH' : paginationData.strategies.numberedLinks.found ? 'MEDIUM' : 'LOW'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('\nPress Ctrl+C to close browser...');
    await new Promise(() => {}); // Wait indefinitely
  }
}

testLosAngelesPagination();

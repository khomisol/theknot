/**
 * Investigate pagination structure on TheKnot
 * Determine the proper logic for extracting max page number
 */

import { chromium } from 'playwright';

async function investigatePagination() {
  console.log('=== Investigating TheKnot Pagination ===\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = 'https://www.theknot.com/marketplace/wedding-reception-venues-new-york-ny';
    console.log(`Navigating to: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for page to load
    await page.waitForTimeout(5000);

    console.log('=== STRATEGY 1: Look for pagination container ===\n');
    
    // Find pagination container
    const paginationInfo = await page.evaluate(() => {
      const results: any = {
        containers: [],
        allLinks: [],
        allButtons: [],
        textContent: []
      };

      // Look for pagination containers
      const possibleContainers = [
        document.querySelector('nav[aria-label*="pagination"]'),
        document.querySelector('[class*="pagination"]'),
        document.querySelector('[data-testid*="pagination"]'),
        document.querySelector('[role="navigation"]')
      ].filter(el => el !== null);

      possibleContainers.forEach((container: any, index) => {
        if (container) {
          results.containers.push({
            index: index + 1,
            tagName: container.tagName,
            className: container.className,
            ariaLabel: container.getAttribute('aria-label'),
            innerHTML: container.innerHTML.substring(0, 500) // First 500 chars
          });
        }
      });

      // Look for all links with "page" in aria-label
      const pageLinks = Array.from(document.querySelectorAll('a[aria-label*="page"], a[aria-label*="Page"]'));
      pageLinks.forEach((link: any) => {
        results.allLinks.push({
          href: link.getAttribute('href'),
          ariaLabel: link.getAttribute('aria-label'),
          text: link.textContent?.trim(),
          className: link.className
        });
      });

      // Look for all buttons with "page" in aria-label
      const pageButtons = Array.from(document.querySelectorAll('button[aria-label*="page"], button[aria-label*="Page"]'));
      pageButtons.forEach((button: any) => {
        results.allButtons.push({
          ariaLabel: button.getAttribute('aria-label'),
          text: button.textContent?.trim(),
          className: button.className,
          disabled: button.disabled
        });
      });

      // Look for text like "Page X of Y" or "1-30 of 900"
      const bodyText = document.body.textContent || '';
      const patterns = [
        /Page\s+(\d+)\s+of\s+(\d+)/gi,
        /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/gi,
        /Showing\s+(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/gi
      ];

      patterns.forEach(pattern => {
        const matches = bodyText.matchAll(pattern);
        for (const match of matches) {
          results.textContent.push({
            pattern: pattern.toString(),
            match: match[0],
            groups: Array.from(match).slice(1)
          });
        }
      });

      return results;
    });

    console.log('Pagination Containers Found:', paginationInfo.containers.length);
    paginationInfo.containers.forEach((container: any) => {
      console.log(`\nContainer #${container.index}:`);
      console.log(`  Tag: ${container.tagName}`);
      console.log(`  Class: ${container.className}`);
      console.log(`  Aria-Label: ${container.ariaLabel}`);
      console.log(`  HTML Preview: ${container.innerHTML.substring(0, 200)}...`);
    });

    console.log('\n=== Page Links Found:', paginationInfo.allLinks.length, '===');
    paginationInfo.allLinks.forEach((link: any, index: number) => {
      console.log(`\nLink #${index + 1}:`);
      console.log(`  Aria-Label: ${link.ariaLabel}`);
      console.log(`  Text: ${link.text}`);
      console.log(`  Href: ${link.href}`);
      console.log(`  Class: ${link.className}`);
    });

    console.log('\n=== Page Buttons Found:', paginationInfo.allButtons.length, '===');
    paginationInfo.allButtons.forEach((button: any, index: number) => {
      console.log(`\nButton #${index + 1}:`);
      console.log(`  Aria-Label: ${button.ariaLabel}`);
      console.log(`  Text: ${button.text}`);
      console.log(`  Disabled: ${button.disabled}`);
      console.log(`  Class: ${button.className}`);
    });

    console.log('\n=== Text Patterns Found:', paginationInfo.textContent.length, '===');
    paginationInfo.textContent.forEach((item: any, index: number) => {
      console.log(`\nPattern #${index + 1}:`);
      console.log(`  Match: ${item.match}`);
      console.log(`  Groups: ${item.groups.join(', ')}`);
    });

    console.log('\n=== STRATEGY 2: Extract max page number ===\n');

    const maxPage = await page.evaluate(() => {
      // Strategy 1: Look for numbered page links
      const pageLinks = Array.from(document.querySelectorAll('a[aria-label*="Go to page"], button[aria-label*="Go to page"]'));
      if (pageLinks.length > 0) {
        const pageNumbers = pageLinks.map((link: any) => {
          const match = link.getAttribute('aria-label')?.match(/page (\d+)/i);
          return match ? parseInt(match[1]) : 0;
        });
        const max = Math.max(...pageNumbers);
        if (max > 0) {
          return { strategy: 'Numbered page links', maxPage: max };
        }
      }

      // Strategy 2: Look for "Page X of Y" text
      const bodyText = document.body.textContent || '';
      const pageMatch = bodyText.match(/Page \d+ of (\d+)/i);
      if (pageMatch) {
        return { strategy: 'Page X of Y text', maxPage: parseInt(pageMatch[1]) };
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

        if (numbers.length > 0) {
          return { strategy: 'Pagination nav numbers', maxPage: Math.max(...numbers) };
        }
      }

      // Strategy 4: Look for "last page" or "final page" link
      const lastPageLink = document.querySelector('a[aria-label*="last"], a[aria-label*="final"], button[aria-label*="last"]');
      if (lastPageLink) {
        const href = lastPageLink.getAttribute('href');
        if (href) {
          const match = href.match(/page=(\d+)/);
          if (match) {
            return { strategy: 'Last page link', maxPage: parseInt(match[1]) };
          }
        }
      }

      return { strategy: 'None found', maxPage: 1 };
    });

    console.log(`Strategy Used: ${maxPage.strategy}`);
    console.log(`Max Page Number: ${maxPage.maxPage}`);

    console.log('\n=== STRATEGY 3: Take screenshot of pagination ===\n');
    
    // Scroll to pagination
    await page.evaluate(() => {
      const pagination = document.querySelector('nav[aria-label*="pagination"], [class*="pagination"]');
      if (pagination) {
        pagination.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshotPath = 'data/screenshots/pagination-investigation.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved: ${screenshotPath}`);

    console.log('\n=== STRATEGY 4: Inspect pagination HTML ===\n');

    const paginationHTML = await page.evaluate(() => {
      const pagination = document.querySelector('nav[aria-label*="pagination"], [class*="pagination"]');
      if (pagination) {
        return {
          outerHTML: pagination.outerHTML,
          textContent: pagination.textContent?.trim()
        };
      }
      return null;
    });

    if (paginationHTML) {
      console.log('Pagination HTML:');
      console.log(paginationHTML.outerHTML);
      console.log('\nPagination Text Content:');
      console.log(paginationHTML.textContent);
    } else {
      console.log('No pagination container found');
    }

    console.log('\n=== FINAL RECOMMENDATION ===\n');
    console.log(`Based on the investigation, the best strategy is: ${maxPage.strategy}`);
    console.log(`Maximum page number detected: ${maxPage.maxPage}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log('\nPress Ctrl+C to close browser...');
    // Keep browser open for manual inspection
    await new Promise(() => {}); // Wait indefinitely
  }
}

investigatePagination();

import { describe, it, expect } from 'vitest';
import { TheKnotAdapter } from '../adapters/theknot-adapter';

describe('TheKnotAdapter', () => {
  describe('buildUrl', () => {
    it('should build basic URL with category and location', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          category: 'wedding-reception-venues',
          location: 'los-angeles-ca',
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-reception-venues-los-angeles-ca'
      );
    });

    it('should build URL with pagination (page 2)', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          category: 'wedding-reception-venues',
          location: 'seattle-wa',
          page: 2,
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa?page=2'
      );
    });

    it('should build URL with pagination (page 3)', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          category: 'wedding-ceremony-venues',
          location: 'new-york-ny',
          page: 3,
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-ceremony-venues-new-york-ny?page=3'
      );
    });

    it('should not add page parameter for page 1', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          category: 'wedding-reception-venues',
          location: 'chicago-il',
          page: 1,
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-reception-venues-chicago-il'
      );
      expect(url).not.toContain('?page=');
    });

    it('should use default category if not provided', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          location: 'miami-fl',
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-reception-venues-miami-fl'
      );
    });

    it('should use default location if not provided', () => {
      const adapter = new TheKnotAdapter({
        parameters: {
          category: 'wedding-ceremony-venues',
        },
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-ceremony-venues-seattle-wa'
      );
    });

    it('should use both defaults if no parameters provided', () => {
      const adapter = new TheKnotAdapter({
        parameters: {},
      });

      const url = adapter.buildUrl();

      expect(url).toBe(
        'https://www.theknot.com/marketplace/wedding-reception-venues-seattle-wa'
      );
    });

    it('should handle different category types', () => {
      const categories = [
        'wedding-reception-venues',
        'wedding-ceremony-venues',
        'wedding-photographers',
        'wedding-florists',
      ];

      categories.forEach((category) => {
        const adapter = new TheKnotAdapter({
          parameters: {
            category,
            location: 'boston-ma',
          },
        });

        const url = adapter.buildUrl();

        expect(url).toBe(
          `https://www.theknot.com/marketplace/${category}-boston-ma`
        );
      });
    });

    it('should handle different locations', () => {
      const locations = [
        'los-angeles-ca',
        'new-york-ny',
        'chicago-il',
        'houston-tx',
        'phoenix-az',
      ];

      locations.forEach((location) => {
        const adapter = new TheKnotAdapter({
          parameters: {
            category: 'wedding-reception-venues',
            location,
          },
        });

        const url = adapter.buildUrl();

        expect(url).toBe(
          `https://www.theknot.com/marketplace/wedding-reception-venues-${location}`
        );
      });
    });
  });
});

  describe('hasNextPage', () => {
    it('should return true when next page link exists', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      // Mock page with next link
      const mockPage = {
        $: async (selector: string) => {
          if (selector === 'a[aria-label="Go to next page"]') {
            return { exists: true }; // Mock element
          }
          return null;
        },
      } as any;

      const hasNext = await adapter.hasNextPage(mockPage);

      expect(hasNext).toBe(true);
    });

    it('should return false when next page link does not exist', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      // Mock page without next link
      const mockPage = {
        $: async () => null,
      } as any;

      const hasNext = await adapter.hasNextPage(mockPage);

      expect(hasNext).toBe(false);
    });

    it('should return false on error', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      // Mock page that throws error
      const mockPage = {
        $: async () => {
          throw new Error('Page error');
        },
      } as any;

      const hasNext = await adapter.hasNextPage(mockPage);

      expect(hasNext).toBe(false);
    });
  });

  describe('goToNextPage', () => {
    it('should click next link and wait for content', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      let clicked = false;
      let waitedForSelector = false;
      let waitedForTimeout = false;

      // Mock page with next link
      const mockPage = {
        $: async (selector: string) => {
          if (selector === 'a[aria-label="Go to next page"]') {
            return {
              click: async () => {
                clicked = true;
              },
            };
          }
          return null;
        },
        waitForSelector: async (selector: string) => {
          if (selector === '[data-testid="vendor-card-base"]') {
            waitedForSelector = true;
          }
        },
        waitForTimeout: async () => {
          waitedForTimeout = true;
        },
      } as any;

      await adapter.goToNextPage(mockPage);

      expect(clicked).toBe(true);
      expect(waitedForSelector).toBe(true);
      expect(waitedForTimeout).toBe(true);
    });

    it('should throw error when next link not found', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      // Mock page without next link
      const mockPage = {
        $: async () => null,
      } as any;

      await expect(adapter.goToNextPage(mockPage)).rejects.toThrow(
        'Next page link not found'
      );
    });

    it('should throw error when navigation fails', async () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      // Mock page where click fails
      const mockPage = {
        $: async () => ({
          click: async () => {
            throw new Error('Click failed');
          },
        }),
      } as any;

      await expect(adapter.goToNextPage(mockPage)).rejects.toThrow();
    });
  });

  describe('getRateLimit', () => {
    it('should return TheKnot-specific rate limits', () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      const rateLimit = adapter.getRateLimit();

      expect(rateLimit.min).toBe(2000);
      expect(rateLimit.max).toBe(4000);
    });

    it('should return values in milliseconds', () => {
      const adapter = new TheKnotAdapter({ parameters: {} });

      const rateLimit = adapter.getRateLimit();

      expect(rateLimit.min).toBeGreaterThan(0);
      expect(rateLimit.max).toBeGreaterThan(rateLimit.min);
    });
  });

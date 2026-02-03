import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, unlink } from 'fs/promises';
import { exportToCSV, exportToJSON } from '../workers/exporters';
import type { ScrapedItem } from '../types/worker';

describe('Data Exporters', () => {
  const testFilePath = 'test-export';

  afterEach(async () => {
    // Clean up test files
    try {
      await unlink(`${testFilePath}.csv`);
    } catch {}
    try {
      await unlink(`${testFilePath}.json`);
    } catch {}
  });

  describe('exportToCSV', () => {
    it('should export items to CSV format', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          location: 'Seattle, WA',
          rating: 4.5,
          reviews: 100,
          price: '$1,000',
          url: 'https://example.com/venue1',
        },
        {
          name: 'Venue 2',
          location: 'Portland, OR',
          rating: 4.8,
          reviews: 50,
          price: '$2,000',
          url: 'https://example.com/venue2',
        },
      ];

      await exportToCSV(items, `${testFilePath}.csv`);

      const content = await readFile(`${testFilePath}.csv`, 'utf-8');
      const lines = content.split('\n');

      // Check header
      expect(lines[0]).toContain('name');
      expect(lines[0]).toContain('location');
      expect(lines[0]).toContain('rating');
      expect(lines[0]).toContain('reviews');
      expect(lines[0]).toContain('price');
      expect(lines[0]).toContain('url');

      // Check data rows
      expect(lines[1]).toContain('Venue 1');
      expect(lines[2]).toContain('Venue 2');
    });

    it('should handle commas in values', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue, with comma',
          location: 'Seattle, WA',
          url: 'https://example.com',
        },
      ];

      await exportToCSV(items, `${testFilePath}.csv`);

      const content = await readFile(`${testFilePath}.csv`, 'utf-8');

      // Values with commas should be quoted
      expect(content).toContain('"Venue, with comma"');
      expect(content).toContain('"Seattle, WA"');
    });

    it('should handle quotes in values', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue "Best" Place',
          url: 'https://example.com',
        },
      ];

      await exportToCSV(items, `${testFilePath}.csv`);

      const content = await readFile(`${testFilePath}.csv`, 'utf-8');

      // Quotes should be escaped
      expect(content).toContain('""Best""');
    });

    it('should handle undefined values', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          location: undefined,
          rating: undefined,
          url: 'https://example.com',
        },
      ];

      await exportToCSV(items, `${testFilePath}.csv`);

      const content = await readFile(`${testFilePath}.csv`, 'utf-8');
      const lines = content.split('\n');

      // Should have empty values for undefined
      expect(lines[1]).toMatch(/Venue 1,,/);
    });

    it('should throw error for empty items array', async () => {
      await expect(exportToCSV([], `${testFilePath}.csv`)).rejects.toThrow(
        'No items to export'
      );
    });

    it('should handle items with different keys', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          location: 'Seattle',
          url: 'https://example.com/1',
        },
        {
          name: 'Venue 2',
          rating: 4.5,
          url: 'https://example.com/2',
        },
      ];

      await exportToCSV(items, `${testFilePath}.csv`);

      const content = await readFile(`${testFilePath}.csv`, 'utf-8');
      const lines = content.split('\n');

      // Header should include all unique keys
      expect(lines[0]).toContain('name');
      expect(lines[0]).toContain('location');
      expect(lines[0]).toContain('rating');
      expect(lines[0]).toContain('url');
    });
  });

  describe('exportToJSON', () => {
    it('should export items to JSON format', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          location: 'Seattle, WA',
          rating: 4.5,
          reviews: 100,
          price: '$1,000',
          url: 'https://example.com/venue1',
        },
        {
          name: 'Venue 2',
          location: 'Portland, OR',
          rating: 4.8,
          reviews: 50,
          price: '$2,000',
          url: 'https://example.com/venue2',
        },
      ];

      await exportToJSON(items, `${testFilePath}.json`);

      const content = await readFile(`${testFilePath}.json`, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe('Venue 1');
      expect(parsed[1].name).toBe('Venue 2');
    });

    it('should format JSON with indentation', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          url: 'https://example.com',
        },
      ];

      await exportToJSON(items, `${testFilePath}.json`);

      const content = await readFile(`${testFilePath}.json`, 'utf-8');

      // Should be pretty-printed (contains newlines and spaces)
      expect(content).toContain('\n');
      expect(content).toContain('  ');
    });

    it('should handle empty array', async () => {
      const items: ScrapedItem[] = [];

      await exportToJSON(items, `${testFilePath}.json`);

      const content = await readFile(`${testFilePath}.json`, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed).toEqual([]);
    });

    it('should handle undefined values', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue 1',
          location: undefined,
          rating: undefined,
          url: 'https://example.com',
        },
      ];

      await exportToJSON(items, `${testFilePath}.json`);

      const content = await readFile(`${testFilePath}.json`, 'utf-8');
      const parsed = JSON.parse(content);

      // undefined values should not be in JSON
      expect(parsed[0]).toHaveProperty('name');
      expect(parsed[0]).toHaveProperty('url');
      expect(parsed[0]).not.toHaveProperty('location');
      expect(parsed[0]).not.toHaveProperty('rating');
    });

    it('should produce valid JSON', async () => {
      const items: ScrapedItem[] = [
        {
          name: 'Venue with "quotes" and, commas',
          location: 'Seattle, WA',
          url: 'https://example.com',
        },
      ];

      await exportToJSON(items, `${testFilePath}.json`);

      const content = await readFile(`${testFilePath}.json`, 'utf-8');

      // Should not throw
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });
});

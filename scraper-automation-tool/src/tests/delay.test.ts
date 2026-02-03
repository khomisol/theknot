import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomDelay, isRateLimitingEnabled } from '../utils/delay';

describe('Delay Utilities', () => {
  describe('randomDelay', () => {
    it('should generate delay within range', async () => {
      const min = 100;
      const max = 200;

      const delay = await randomDelay(min, max);

      expect(delay).toBeGreaterThanOrEqual(min);
      expect(delay).toBeLessThanOrEqual(max);
    });

    it('should actually wait for the delay', async () => {
      const min = 100;
      const max = 150;
      const startTime = Date.now();

      await randomDelay(min, max);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(min - 10); // Allow 10ms tolerance
      expect(elapsed).toBeLessThanOrEqual(max + 50); // Allow 50ms tolerance
    });

    it('should return the actual delay used', async () => {
      const min = 50;
      const max = 100;

      const delay = await randomDelay(min, max);

      expect(typeof delay).toBe('number');
      expect(delay).toBeGreaterThanOrEqual(min);
      expect(delay).toBeLessThanOrEqual(max);
    });

    it('should generate different delays on multiple calls', async () => {
      const delays: number[] = [];

      for (let i = 0; i < 10; i++) {
        const delay = await randomDelay(100, 200);
        delays.push(delay);
      }

      // Check that not all delays are the same (randomness)
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });

    it('should handle min === max', async () => {
      const value = 100;

      const delay = await randomDelay(value, value);

      expect(delay).toBe(value);
    });
  });

  describe('isRateLimitingEnabled', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      delete process.env.ENABLE_RATE_LIMITING;
    });

    it('should return false in test environment', () => {
      process.env.NODE_ENV = 'test';

      const enabled = isRateLimitingEnabled();

      expect(enabled).toBe(false);
    });

    it('should return true in non-test environment', () => {
      process.env.NODE_ENV = 'production';

      const enabled = isRateLimitingEnabled();

      expect(enabled).toBe(true);
    });

    it('should respect ENABLE_RATE_LIMITING=false override', () => {
      process.env.NODE_ENV = 'production';
      process.env.ENABLE_RATE_LIMITING = 'false';

      const enabled = isRateLimitingEnabled();

      expect(enabled).toBe(false);
    });

    it('should return true when ENABLE_RATE_LIMITING is not set', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.ENABLE_RATE_LIMITING;

      const enabled = isRateLimitingEnabled();

      expect(enabled).toBe(true);
    });
  });
});

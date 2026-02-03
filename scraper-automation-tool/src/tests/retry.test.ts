import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff, isRetryableError } from '../utils/retry';

describe('Retry Utilities', () => {
  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxRetries: 3 });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries exhausted', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Always fails'));

      await expect(
        retryWithBackoff(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow('Failed after 2 attempts');

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 100,
        exponentialBackoff: true,
      });
      const elapsed = Date.now() - startTime;

      // Should wait ~100ms + ~200ms = ~300ms
      expect(elapsed).toBeGreaterThanOrEqual(250);
      expect(elapsed).toBeLessThan(500);
    });

    it('should respect maxDelay', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 100,
        maxDelay: 150,
        exponentialBackoff: true,
      });
      const elapsed = Date.now() - startTime;

      // Should wait ~100ms + ~150ms (capped) = ~250ms
      expect(elapsed).toBeGreaterThanOrEqual(200);
      expect(elapsed).toBeLessThan(400);
    });

    it('should not use exponential backoff when disabled', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 100,
        exponentialBackoff: false,
      });
      const elapsed = Date.now() - startTime;

      // Should wait ~100ms + ~100ms = ~200ms (fixed delay)
      expect(elapsed).toBeGreaterThanOrEqual(150);
      expect(elapsed).toBeLessThan(350);
    });
  });

  describe('isRetryableError', () => {
    it('should identify network errors as retryable', () => {
      const errors = [
        new Error('net::ERR_CONNECTION_REFUSED'),
        new Error('Network error occurred'),
        new Error('Connection timeout'),
      ];

      errors.forEach((error) => {
        expect(isRetryableError(error)).toBe(true);
      });
    });

    it('should identify timeout errors as retryable', () => {
      const errors = [
        new Error('Timeout exceeded'),
        new Error('Request timed out'),
      ];

      errors.forEach((error) => {
        expect(isRetryableError(error)).toBe(true);
      });
    });

    it('should identify 5xx errors as retryable', () => {
      const errors = [
        new Error('HTTP 503 Service Unavailable'),
        new Error('502 Bad Gateway'),
        new Error('504 Gateway Timeout'),
      ];

      errors.forEach((error) => {
        expect(isRetryableError(error)).toBe(true);
      });
    });

    it('should not identify other errors as retryable', () => {
      const errors = [
        new Error('404 Not Found'),
        new Error('Invalid selector'),
        new Error('Element not found'),
      ];

      errors.forEach((error) => {
        expect(isRetryableError(error)).toBe(false);
      });
    });
  });
});

/**
 * Delay Utilities
 * Story 2.5 - Rate Limiting & Delays
 */

/**
 * Generate a random delay within a range and wait
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 * @returns Actual delay used in milliseconds
 */
export async function randomDelay(min: number, max: number): Promise<number> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return delay;
}

/**
 * Check if rate limiting is enabled
 * Can be disabled via environment variable for testing
 */
export function isRateLimitingEnabled(): boolean {
  // Disable in test environment
  if (process.env.NODE_ENV === 'test') {
    return false;
  }

  // Allow explicit override
  if (process.env.ENABLE_RATE_LIMITING === 'false') {
    return false;
  }

  return true;
}

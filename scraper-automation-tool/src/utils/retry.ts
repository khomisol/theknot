/**
 * Retry Utilities
 * Story 2.6 - Error Handling & Edge Cases
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  exponentialBackoff?: boolean;
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Retry configuration
 * @returns Result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    exponentialBackoff = true,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Calculate delay
      let delay = initialDelay;
      if (exponentialBackoff) {
        delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      }

      console.warn(
        `[WARN] Attempt ${attempt + 1}/${maxRetries} failed: ${lastError.message}`
      );
      console.warn(`[WARN] Retrying in ${delay}ms...`);

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Check if an error is retryable
 * @param error Error to check
 * @returns True if error should be retried
 */
export function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Network errors
  if (message.includes('net::err')) return true;
  if (message.includes('network')) return true;
  if (message.includes('connection')) return true;

  // Timeout errors
  if (message.includes('timeout')) return true;
  if (message.includes('timed out')) return true;

  // HTTP errors (5xx)
  if (message.includes('503')) return true;
  if (message.includes('502')) return true;
  if (message.includes('504')) return true;

  return false;
}

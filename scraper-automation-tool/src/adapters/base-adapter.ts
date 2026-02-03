import type { Page } from 'playwright';
import type { ScrapedItem } from '../types/worker';

export interface SiteAdapterConfig {
  parameters: Record<string, any>;
}

export abstract class BaseSiteAdapter {
  protected config: SiteAdapterConfig;

  constructor(config: SiteAdapterConfig) {
    this.config = config;
  }

  abstract buildUrl(): string;
  abstract extractData(page: Page): Promise<ScrapedItem[]>;
  abstract hasNextPage(page: Page): Promise<boolean>;
  abstract goToNextPage(page: Page): Promise<void>;

  /**
   * Get total number of pages available
   * Override in site-specific adapters
   */
  async getTotalPages(page: Page): Promise<number> {
    // Default implementation: return 1 page
    return 1;
  }

  /**
   * Get rate limit configuration for this site
   * Returns min and max delay in milliseconds
   * Override in site-specific adapters
   */
  getRateLimit(): { min: number; max: number } {
    // Default: 1-2 seconds between requests
    return { min: 1000, max: 2000 };
  }
}

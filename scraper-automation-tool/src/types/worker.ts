export interface WorkerConfig {
  headless: boolean;
  timeout: number;
  maxRetries: number;
}

export interface ScrapedItem {
  name?: string;
  location?: string;
  rating?: number | string; // Can be number (4.5) or "New" for new venues
  reviews?: number;
  price?: string;
  url?: string;
  // Epic 7: Detail enrichment fields
  website?: string;
  website_clean?: string; // Website URL without UTM/tracking parameters
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  pinterest?: string;
  twitter?: string;
  [key: string]: any;
}

export interface WorkerResult {
  items: ScrapedItem[];
  pagesScraped: number;
  itemsExtracted: number;
  itemsEnriched?: number; // For enrichment jobs
}

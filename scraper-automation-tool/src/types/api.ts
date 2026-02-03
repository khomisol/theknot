export interface SubmitJobRequest {
  site: string;
  parameters: Record<string, any>;
  format: 'csv' | 'json';
  webhook_url?: string;
  headless?: boolean; // Optional: control browser visibility
  job_type?: 'scrape' | 'enrich'; // Epic 7: Job type
}

export interface EnrichJobRequest {
  site: string;
  venueUrls: string[]; // Array of venue URLs to enrich
  originalData?: any[]; // Optional: Original venue data to merge with enriched data
  format: 'csv' | 'json';
  webhook_url?: string;
  headless?: boolean;
}

export interface SubmitJobResponse {
  jobId?: string; // For HTML UI compatibility
  job_id: string;
  status: string;
  created_at: string;
  message: string;
}

export interface JobStatusResponse {
  id?: string; // For HTML UI compatibility
  job_id: string;
  site: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  parameters: Record<string, any>;
  format: 'csv' | 'json';
  progress: {
    pages_scraped: number;
    items_extracted: number;
  };
  result_file_path?: string;
  error_message?: string;
  webhook_url?: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  duration_ms: number | null;
}

export interface JobListItem {
  id?: string; // For HTML UI compatibility
  job_id: string;
  site: string;
  status: string;
  parameters?: Record<string, any>;
  format: string;
  created_at: string;
}

export interface JobListResponse {
  jobs: JobListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface JobNotFoundResponse {
  error: string;
  job_id: string;
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}

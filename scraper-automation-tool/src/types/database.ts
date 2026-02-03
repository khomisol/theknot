export interface Job {
  id: string;
  site: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  parameters: Record<string, any>;
  pages_scraped: number;
  items_extracted: number;
  result_file_path: string | null;
  format: 'csv' | 'json';
  headless: boolean; // Browser visibility setting
  job_type: 'scrape' | 'enrich'; // Epic 7: Job type
  started_at: Date | null;
  finished_at: Date | null;
  duration_ms: number | null;
  error_message: string | null;
  webhook_url: string | null;
  created_at: Date;
}

export interface JobLog {
  id: number;
  job_id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context: Record<string, any> | null;
  created_at: Date;
}

export interface Screenshot {
  id: number;
  job_id: string;
  file_path: string;
  context: string;
  created_at: Date;
}

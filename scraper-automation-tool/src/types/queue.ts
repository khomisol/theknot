export interface QueueConfig {
  concurrency: number;
  pollInterval: number; // milliseconds
}

export interface QueueJob {
  id: string;
  site: string;
  parameters: Record<string, any>;
  format: 'csv' | 'json';
  headless: boolean;
  webhook_url: string | null;
  job_type?: 'scrape' | 'enrich'; // Epic 7: Job type for enrichment
}

export interface QueueStats {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  activeWorkers: number;
}

export type QueueEvent =
  | 'job-queued'
  | 'job-started'
  | 'job-completed'
  | 'job-failed'
  | 'queue-paused'
  | 'queue-resumed';

import { EventEmitter } from 'events';
import { listJobs, updateJobStatus } from '../database/jobs';
import { JobWorker } from '../workers/job-worker';
import type { QueueConfig, QueueJob, QueueStats } from '../types/queue';

export class JobQueue extends EventEmitter {
  private queue: QueueJob[] = [];
  private activeJobs: Set<string> = new Set();
  private config: QueueConfig;
  private pollTimer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private worker: JobWorker;

  constructor(config: Partial<QueueConfig> = {}) {
    super();
    this.config = {
      concurrency: config.concurrency || 3,
      pollInterval: config.pollInterval || 5000,
    };
    this.worker = new JobWorker();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`✅ Job queue started (concurrency: ${this.config.concurrency})`);

    // Start polling
    this.poll();
    this.pollTimer = setInterval(() => this.poll(), this.config.pollInterval);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;

    // Stop polling
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    // Wait for active jobs to complete
    console.log(`🛑 Waiting for ${this.activeJobs.size} active jobs to complete...`);
    while (this.activeJobs.size > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Close worker
    await this.worker.close();

    console.log('✅ Job queue stopped');
  }

  pause(): void {
    this.isPaused = true;
    this.emit('queue-paused');
    console.log('⏸️  Job queue paused');
  }

  resume(): void {
    this.isPaused = false;
    this.emit('queue-resumed');
    console.log('▶️  Job queue resumed');
  }

  async enqueue(job: QueueJob): Promise<void> {
    // Add job to queue immediately (don't wait for poll)
    if (!this.queue.find((q) => q.id === job.id) && !this.activeJobs.has(job.id)) {
      this.queue.push(job);
      this.emit('job-queued', job);
      console.log(`📥 Job ${job.id} enqueued (type: ${job.job_type || 'scrape'})`);
      
      // Process immediately if workers available
      this.processQueue();
    }
  }

  private async poll(): Promise<void> {
    if (this.isPaused) return;

    try {
      // Get queued jobs from database
      const jobs = await listJobs({ status: 'queued', limit: 10 });

      // Add new jobs to queue
      for (const job of jobs) {
        if (!this.queue.find((q) => q.id === job.id) && !this.activeJobs.has(job.id)) {
          const queueJob: QueueJob = {
            id: job.id,
            site: job.site,
            parameters: job.parameters,
            format: job.format,
            headless: job.headless,
            job_type: job.job_type || 'scrape', // Include job_type
            webhook_url: job.webhook_url,
          };

          this.queue.push(queueJob);
          this.emit('job-queued', queueJob);
        }
      }

      // Process jobs if workers available
      this.processQueue();
    } catch (error) {
      console.error('❌ Queue poll error:', error);
    }
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.activeJobs.size < this.config.concurrency) {
      const job = this.queue.shift();
      if (!job) break;

      // Mark as active
      this.activeJobs.add(job.id);

      // Process job (don't await - run in background)
      this.processJob(job).catch((error) => {
        console.error(`❌ Job ${job.id} processing error:`, error);
      });
    }
  }

  private async processJob(job: QueueJob): Promise<void> {
    try {
      // Update status to running
      await updateJobStatus(job.id, 'running', {
        started_at: new Date(),
      });

      this.emit('job-started', job);
      console.log(`🚀 Job ${job.id} started`);

      const startTime = Date.now();

      // Execute job with worker
      const result = await this.worker.execute(job);

      const duration = Date.now() - startTime;

      // Update status to completed
      await updateJobStatus(job.id, 'completed', {
        finished_at: new Date(),
        duration_ms: duration,
        pages_scraped: result.pagesScraped,
        items_extracted: result.itemsExtracted,
        result_file_path: `data/${job.id}.${job.format}`,
      });

      this.emit('job-completed', job);
      console.log(
        `✅ Job ${job.id} completed (${result.itemsExtracted} items, ${duration}ms)`
      );
    } catch (error) {
      // Update status to failed
      await updateJobStatus(job.id, 'failed', {
        finished_at: new Date(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      this.emit('job-failed', { job, error });
      console.error(`❌ Job ${job.id} failed:`, error);
    } finally {
      // Remove from active jobs
      this.activeJobs.delete(job.id);

      // Process next job if available
      this.processQueue();
    }
  }

  getStats(): QueueStats {
    return {
      queued: this.queue.length,
      running: this.activeJobs.size,
      completed: 0, // TODO: Track in memory or query database
      failed: 0, // TODO: Track in memory or query database
      activeWorkers: this.activeJobs.size,
    };
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveJobCount(): number {
    return this.activeJobs.size;
  }
}

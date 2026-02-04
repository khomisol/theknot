import type { FastifyInstance } from 'fastify';
import { generateJobId } from '../utils/id-generator';
import { validateSubmitJobRequest } from './validators';
import { createJob, getJob, listJobs } from '../database/jobs';
import { authMiddleware } from './auth-middleware';
import type { JobQueue } from '../queue/job-queue';
import type {
  SubmitJobRequest,
  SubmitJobResponse,
  JobStatusResponse,
  JobListResponse,
  JobNotFoundResponse,
  ErrorResponse,
  EnrichJobRequest,
} from '../types/api';

export async function registerRoutes(app: FastifyInstance, jobQueue: JobQueue) {
  // Root redirect to app.html
  app.get('/', async (request, reply) => {
    return reply.redirect('/app.html');
  });

  // Health check (public, no auth)
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Apply authentication only to API routes
  app.addHook('onRequest', async (request, reply) => {
    // Skip auth for health endpoint
    if (request.url === '/health') {
      return;
    }
    // Skip auth for static files (HTML UI and data downloads)
    if (!request.url.startsWith('/api/')) {
      return;
    }
    await authMiddleware(request, reply);
  });

  // Submit job (support both /api/jobs and /api/scrape for compatibility)
  const submitJobHandler = async (request: any, reply: any) => {
    // Validate request
    const validation = validateSubmitJobRequest(request.body);
    if (!validation.valid) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const { site, parameters, format, webhook_url, headless, job_type } = request.body;

    // Generate job ID
    const jobId = generateJobId();

    // Create job in database
    try {
      await createJob({
        id: jobId,
        site,
        status: 'queued',
        parameters,
        format,
        headless: headless ?? true, // Default to true (headless)
        job_type: job_type || 'scrape', // Default to scrape
        webhook_url: webhook_url || null,
        pages_scraped: 0,
        items_extracted: 0,
        result_file_path: null,
        started_at: null,
        finished_at: null,
        duration_ms: null,
        error_message: null,
      });

      // Add to queue immediately (don't wait for poll)
      await jobQueue.enqueue({
        id: jobId,
        site,
        parameters,
        format,
        headless: headless ?? true,
        job_type: job_type || 'scrape',
        webhook_url: webhook_url || null,
      });

      return reply.status(201).send({
        jobId: jobId, // Support both formats
        job_id: jobId,
        status: 'queued',
        created_at: new Date().toISOString(),
        message: 'Job queued successfully',
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to create job',
      });
    }
  };

  app.post<{
    Body: SubmitJobRequest;
    Reply: SubmitJobResponse | ErrorResponse;
  }>('/api/jobs', submitJobHandler);

  app.post<{
    Body: SubmitJobRequest;
    Reply: SubmitJobResponse | ErrorResponse;
  }>('/api/scrape', submitJobHandler);

  // Epic 7: Submit enrichment job
  app.post<{
    Body: EnrichJobRequest;
    Reply: SubmitJobResponse | ErrorResponse;
  }>('/api/enrich', async (request, reply) => {
    const { site, venueUrls, originalData, format, webhook_url, headless } = request.body;

    // Validate request
    if (!site || !venueUrls || !Array.isArray(venueUrls) || venueUrls.length === 0) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: ['site and venueUrls (array) are required'],
      });
    }

    if (!format || !['csv', 'json'].includes(format)) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: ['format must be csv or json'],
      });
    }

    // Generate job ID
    const jobId = generateJobId();

    // Create job in database
    try {
      await createJob({
        id: jobId,
        site,
        status: 'queued',
        parameters: { venueUrls, originalData }, // Include originalData
        format,
        headless: headless ?? true,
        job_type: 'enrich',
        webhook_url: webhook_url || null,
        pages_scraped: 0,
        items_extracted: 0,
        result_file_path: null,
        started_at: null,
        finished_at: null,
        duration_ms: null,
        error_message: null,
      });

      // Add to queue immediately
      await jobQueue.enqueue({
        id: jobId,
        site,
        parameters: { venueUrls, originalData }, // Include originalData
        format,
        headless: headless ?? true,
        job_type: 'enrich',
        webhook_url: webhook_url || null,
      });

      return reply.status(201).send({
        jobId: jobId,
        job_id: jobId,
        status: 'queued',
        created_at: new Date().toISOString(),
        message: `Enrichment job queued for ${venueUrls.length} venues`,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to create enrichment job',
      });
    }
  });

  // Get job status
  app.get<{
    Params: { id: string };
    Reply: JobStatusResponse | JobNotFoundResponse;
  }>('/api/jobs/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const job = await getJob(id);

      if (!job) {
        return reply.status(404).send({
          error: 'Job not found',
          job_id: id,
        });
      }

      // Add cache-control headers to prevent browser caching
      reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');

      return reply.status(200).send({
        id: job.id, // Support both formats
        job_id: job.id,
        site: job.site,
        status: job.status,
        parameters: job.parameters,
        format: job.format,
        progress: {
          pages_scraped: job.pages_scraped,
          items_extracted: job.items_extracted,
        },
        result_file_path: job.result_file_path || undefined,
        error_message: job.error_message || undefined,
        webhook_url: job.webhook_url || undefined,
        created_at: job.created_at.toISOString(),
        started_at: job.started_at ? job.started_at.toISOString() : null,
        finished_at: job.finished_at ? job.finished_at.toISOString() : null,
        duration_ms: job.duration_ms,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to retrieve job',
        job_id: id,
      } as JobNotFoundResponse);
    }
  });

  // List jobs
  app.get<{
    Querystring: {
      status?: string;
      site?: string;
      limit?: string;
      offset?: string;
    };
    Reply: JobListResponse | ErrorResponse;
  }>('/api/jobs', async (request, reply) => {
    try {
      const limit = Math.min(parseInt(request.query.limit || '20', 10), 100);
      const offset = parseInt(request.query.offset || '0', 10);

      const filters: any = { limit, offset };
      if (request.query.status) filters.status = request.query.status;
      if (request.query.site) filters.site = request.query.site;

      const jobs = await listJobs(filters);

      // Add cache-control headers to prevent browser caching
      reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');

      return reply.status(200).send({
        jobs: jobs.map((job) => ({
          id: job.id, // Support both formats
          job_id: job.id,
          site: job.site,
          status: job.status,
          parameters: job.parameters,
          format: job.format,
          items_extracted: job.items_extracted,
          pages_scraped: job.pages_scraped,
          created_at: job.created_at.toISOString(),
          started_at: job.started_at ? job.started_at.toISOString() : null,
          finished_at: job.finished_at ? job.finished_at.toISOString() : null,
          duration_ms: job.duration_ms,
        })),
        total: jobs.length,
        limit,
        offset,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to list jobs',
      });
    }
  });

  // Queue stats endpoint
  app.get('/api/queue/stats', async () => {
    return jobQueue.getStats();
  });

  // Get scraped data from a completed job
  app.get<{
    Params: { id: string };
  }>('/api/jobs/:id/data', async (request, reply) => {
    const { id } = request.params;

    try {
      const job = await getJob(id);

      if (!job) {
        return reply.status(404).send({
          error: 'Job not found',
          job_id: id,
        });
      }

      if (job.status !== 'completed') {
        return reply.status(400).send({
          error: 'Job not completed yet',
          status: job.status,
        });
      }

      if (!job.result_file_path) {
        return reply.status(404).send({
          error: 'No result file found',
        });
      }

      // Read the result file
      const fs = require('fs').promises;
      const path = require('path');
      const Papa = require('papaparse');
      const filePath = path.join(process.cwd(), job.result_file_path);

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Parse data based on format
        let data;
        if (job.format === 'json') {
          data = JSON.parse(fileContent);
        } else {
          // Use PapaParse for proper CSV parsing
          const parsed = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true, // Auto-convert numbers
          });
          data = parsed.data;
        }

        return reply.status(200).send({
          job_id: id,
          format: job.format,
          items_count: job.items_extracted,
          data: data,
        });
      } catch (fileError) {
        return reply.status(404).send({
          error: 'Result file not found or cannot be read',
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to retrieve job data',
      });
    }
  });

  // AI-powered endpoints
  const { geminiService } = await import('../services/gemini-service');

  // AI: Suggest locations
  app.post('/api/ai/suggest-locations', async (request: any, reply: any) => {
    if (!geminiService.isAvailable()) {
      return reply.status(503).send({
        error: 'AI service not available',
      });
    }

    const { input } = request.body;
    if (!input || typeof input !== 'string') {
      return reply.status(400).send({
        error: 'Input required',
      });
    }

    try {
      const suggestions = await geminiService.suggestLocations(input);
      return reply.send({ suggestions });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to generate suggestions',
      });
    }
  });

  // AI: Generate data insights
  app.post('/api/ai/insights', async (request: any, reply: any) => {
    if (!geminiService.isAvailable()) {
      return reply.status(503).send({
        error: 'AI service not available',
      });
    }

    const { data } = request.body;
    if (!Array.isArray(data)) {
      return reply.status(400).send({
        error: 'Data array required',
      });
    }

    try {
      const insights = await geminiService.generateDataInsights(data);
      return reply.send({ insights });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to generate insights',
      });
    }
  });

  // AI: Suggest scraping parameters
  app.post('/api/ai/suggest-params', async (request: any, reply: any) => {
    if (!geminiService.isAvailable()) {
      return reply.status(503).send({
        error: 'AI service not available',
      });
    }

    const { goal } = request.body;
    if (!goal || typeof goal !== 'string') {
      return reply.status(400).send({
        error: 'Goal required',
      });
    }

    try {
      const params = await geminiService.suggestScrapingParams(goal);
      return reply.send({ params });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Failed to suggest parameters',
      });
    }
  });
}


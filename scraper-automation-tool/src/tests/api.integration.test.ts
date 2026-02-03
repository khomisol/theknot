import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestApp, closeTestApp, TEST_API_KEY, waitForJobCompletion } from './helpers';
import type { FastifyInstance } from 'fastify';
import type { JobQueue } from '../queue/job-queue';
import { readFile } from 'fs/promises';

describe('API Integration Tests', () => {
  let app: FastifyInstance;
  let queue: JobQueue;

  beforeAll(async () => {
    process.env.API_KEYS = TEST_API_KEY;
    const testApp = await createTestApp();
    app = testApp.app;
    queue = testApp.queue;
  });

  afterAll(async () => {
    await closeTestApp(app, queue);
  });

  describe('Health Endpoint', () => {
    it('should return health status without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('Authentication', () => {
    it('should reject requests without API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        payload: {
          site: 'theknot',
          parameters: {},
          format: 'csv',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe('API key is required');
    });

    it('should reject requests with invalid API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': 'invalid_key' },
        payload: {
          site: 'theknot',
          parameters: {},
          format: 'csv',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toBe('Invalid API key');
    });

    it('should accept requests with valid API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {
          site: 'theknot',
          parameters: { location: 'Test' },
          format: 'csv',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.job_id).toBeDefined();
      expect(body.status).toBe('queued');
    });
  });

  describe('Job Submission', () => {
    it('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {},
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation failed');
      expect(body.details).toBeDefined();
    });

    it('should validate format field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {
          site: 'theknot',
          parameters: {},
          format: 'xml',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Validation failed');
    });

    it('should create job with CSV format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {
          site: 'theknot',
          parameters: { location: 'New York' },
          format: 'csv',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.job_id).toBeDefined();
      expect(body.status).toBe('queued');
      expect(body.message).toBe('Job queued successfully');
    });

    it('should create job with JSON format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {
          site: 'theknot',
          parameters: { location: 'Los Angeles' },
          format: 'json',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.job_id).toBeDefined();
      expect(body.status).toBe('queued');
    });
  });

  describe('Job Status', () => {
    it('should return 404 for non-existent job', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/jobs/non-existent-id',
        headers: { 'x-api-key': TEST_API_KEY },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Job not found');
    });

    it('should return job status', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
        payload: {
          site: 'theknot',
          parameters: { location: 'Test' },
          format: 'csv',
        },
      });

      const { job_id } = JSON.parse(createResponse.body);

      const statusResponse = await app.inject({
        method: 'GET',
        url: `/api/jobs/${job_id}`,
        headers: { 'x-api-key': TEST_API_KEY },
      });

      expect(statusResponse.statusCode).toBe(200);
      const body = JSON.parse(statusResponse.body);
      expect(body.job_id).toBe(job_id);
      expect(body.site).toBe('theknot');
      expect(body.format).toBe('csv');
      expect(body.progress).toBeDefined();
    });
  });

  describe('Job List', () => {
    it('should list jobs', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/jobs',
        headers: { 'x-api-key': TEST_API_KEY },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.jobs).toBeDefined();
      expect(Array.isArray(body.jobs)).toBe(true);
      expect(body.total).toBeDefined();
      expect(body.limit).toBeDefined();
      expect(body.offset).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/jobs?limit=5&offset=0',
        headers: { 'x-api-key': TEST_API_KEY },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.limit).toBe(5);
      expect(body.offset).toBe(0);
    });
  });

  describe('Queue Stats', () => {
    it('should return queue statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/queue/stats',
        headers: { 'x-api-key': TEST_API_KEY },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.queued).toBeDefined();
      expect(body.running).toBeDefined();
      expect(body.completed).toBeDefined();
      expect(body.failed).toBeDefined();
      expect(body.activeWorkers).toBeDefined();
    });
  });

  describe('End-to-End Job Processing', () => {
    it(
      'should process job and generate CSV file',
      async () => {
        const createResponse = await app.inject({
          method: 'POST',
          url: '/api/jobs',
          headers: { 'x-api-key': TEST_API_KEY },
          payload: {
            site: 'theknot',
            parameters: { 
              location: 'seattle-wa',
              category: 'wedding-reception-venues'
            },
            format: 'csv',
          },
        });

        expect(createResponse.statusCode).toBe(201);
        const { job_id } = JSON.parse(createResponse.body);

        await waitForJobCompletion(app, job_id);

        const statusResponse = await app.inject({
          method: 'GET',
          url: `/api/jobs/${job_id}`,
          headers: { 'x-api-key': TEST_API_KEY },
        });

        const job = JSON.parse(statusResponse.body);
        expect(job.status).toBe('completed');
        expect(job.progress.pages_scraped).toBeGreaterThan(0);
        expect(job.progress.items_extracted).toBeGreaterThan(0);
        expect(job.result_file_path).toBeDefined();
        expect(job.duration_ms).toBeGreaterThan(0);

        const fileContent = await readFile(job.result_file_path, 'utf-8');
        expect(fileContent).toContain('name,location,rating');
      },
      15000
    );

    it(
      'should process job and generate JSON file',
      async () => {
        const createResponse = await app.inject({
          method: 'POST',
          url: '/api/jobs',
          headers: { 'x-api-key': TEST_API_KEY },
          payload: {
            site: 'theknot',
            parameters: { 
              location: 'los-angeles-ca',
              category: 'wedding-reception-venues'
            },
            format: 'json',
          },
        });

        expect(createResponse.statusCode).toBe(201);
        const { job_id } = JSON.parse(createResponse.body);

        await waitForJobCompletion(app, job_id);

        const statusResponse = await app.inject({
          method: 'GET',
          url: `/api/jobs/${job_id}`,
          headers: { 'x-api-key': TEST_API_KEY },
        });

        const job = JSON.parse(statusResponse.body);
        expect(job.status).toBe('completed');
        expect(job.result_file_path).toContain('.json');

        const fileContent = await readFile(job.result_file_path, 'utf-8');
        const data = JSON.parse(fileContent);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
      },
      15000
    );
  });
});

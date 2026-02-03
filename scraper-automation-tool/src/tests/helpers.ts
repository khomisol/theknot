import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from '../api/routes';
import { JobQueue } from '../queue/job-queue';

export async function createTestApp(): Promise<{
  app: FastifyInstance;
  queue: JobQueue;
}> {
  const app = Fastify({ logger: false });
  const queue = new JobQueue({ concurrency: 1, pollInterval: 1000 });

  await app.register(cors, { origin: true });
  await registerRoutes(app, queue);
  await queue.start();

  return { app, queue };
}

export async function closeTestApp(app: FastifyInstance, queue: JobQueue): Promise<void> {
  await queue.stop();
  await app.close();
}

export const TEST_API_KEY = 'test_api_key_12345';

export function waitForJobCompletion(
  app: FastifyInstance,
  jobId: string,
  maxWait: number = 10000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      try {
        const response = await app.inject({
          method: 'GET',
          url: `/api/jobs/${jobId}`,
          headers: { 'x-api-key': TEST_API_KEY },
        });

        const job = JSON.parse(response.body);
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(interval);
          resolve();
        }

        if (Date.now() - startTime > maxWait) {
          clearInterval(interval);
          reject(new Error('Job did not complete in time'));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 500);
  });
}

import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase, closeDatabase } from './database';
import { registerRoutes } from './api/routes';
import { JobQueue } from './queue/job-queue';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const QUEUE_CONCURRENCY = parseInt(process.env.QUEUE_CONCURRENCY || '3', 10);

async function main() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Initialize job queue
  const jobQueue = new JobQueue({ concurrency: QUEUE_CONCURRENCY });

  // Queue event listeners
  jobQueue.on('job-queued', (job) => {
    app.log.info(`📥 Job queued: ${job.id}`);
  });

  jobQueue.on('job-started', (job) => {
    app.log.info(`🚀 Job started: ${job.id}`);
  });

  jobQueue.on('job-completed', (job) => {
    app.log.info(`✅ Job completed: ${job.id}`);
  });

  jobQueue.on('job-failed', ({ job, error }) => {
    app.log.error(`❌ Job failed: ${job.id}`, error);
  });

  try {
    // Enable CORS
    await app.register(cors, {
      origin: true,
    });

    // Serve static files from public directory (with no-cache for development)
    await app.register(fastifyStatic, {
      root: path.join(__dirname, '../public'),
      prefix: '/',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      },
    });

    // Serve data files for downloads
    await app.register(fastifyStatic, {
      root: path.join(__dirname, '../data'),
      prefix: '/data/',
      decorateReply: false,
    });

    // Initialize database
    await initializeDatabase();
    app.log.info('✅ Database initialized');

    // Register routes (pass jobQueue for stats endpoint)
    await registerRoutes(app, jobQueue);
    app.log.info('✅ Routes registered');

    // Start job queue
    await jobQueue.start();
    app.log.info('✅ Job queue started');

    // Start server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`✅ Server listening on http://localhost:${PORT}`);

    // Graceful shutdown
    const shutdown = async () => {
      app.log.info('🛑 Shutting down...');
      await jobQueue.stop();
      await app.close();
      await closeDatabase();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();

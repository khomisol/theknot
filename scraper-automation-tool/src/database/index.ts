import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
  process.exit(-1);
});

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        site TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('queued', 'running', 'completed', 'failed')),
        parameters JSONB NOT NULL,
        pages_scraped INTEGER DEFAULT 0,
        items_extracted INTEGER DEFAULT 0,
        result_file_path TEXT,
        format TEXT NOT NULL CHECK(format IN ('csv', 'json')),
        headless BOOLEAN DEFAULT true,
        started_at TIMESTAMP,
        finished_at TIMESTAMP,
        duration_ms INTEGER,
        error_message TEXT,
        webhook_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Epic 7: Add job_type column for enrichment jobs
    await client.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS job_type TEXT DEFAULT 'scrape' CHECK(job_type IN ('scrape', 'enrich'))
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS job_logs (
        id SERIAL PRIMARY KEY,
        job_id TEXT NOT NULL REFERENCES jobs(id),
        level TEXT NOT NULL CHECK(level IN ('error', 'warn', 'info', 'debug')),
        message TEXT NOT NULL,
        context JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS screenshots (
        id SERIAL PRIMARY KEY,
        job_id TEXT NOT NULL REFERENCES jobs(id),
        file_path TEXT NOT NULL,
        context TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
      CREATE INDEX IF NOT EXISTS idx_jobs_site ON jobs(site);
      CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
      CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON job_logs(job_id);
      CREATE INDEX IF NOT EXISTS idx_screenshots_job_id ON screenshots(job_id);
    `);

    console.log('✅ Database schema initialized');
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
  console.log('✅ Database closed');
}

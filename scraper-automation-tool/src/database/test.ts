import { initializeDatabase, closeDatabase } from './index';
import { createJob, getJob, updateJobStatus, listJobs } from './jobs';
import { createJobLog, getJobLogs } from './logs';

async function runTests() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized');

    const testJob = await createJob({
      id: 'test_job_001',
      site: 'theknot',
      status: 'queued',
      parameters: { location: 'test', category: 'test' },
      format: 'csv',
      pages_scraped: 0,
      items_extracted: 0,
      result_file_path: null,
      started_at: null,
      finished_at: null,
      duration_ms: null,
      error_message: null,
      webhook_url: null,
      headless: true,
      job_type: 'scrape',
    });
    console.log('✅ Job created:', testJob.id);

    const retrieved = await getJob('test_job_001');
    console.log('✅ Job retrieved:', retrieved?.id);

    await updateJobStatus('test_job_001', 'running', { started_at: new Date() });
    console.log('✅ Job updated');

    await createJobLog({
      job_id: 'test_job_001',
      level: 'info',
      message: 'Test log',
      context: null,
    });
    console.log('✅ Log created');

    const logs = await getJobLogs('test_job_001');
    console.log('✅ Logs retrieved:', logs.length);

    const jobs = await listJobs({ limit: 10 });
    console.log('✅ Jobs listed:', jobs.length);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

runTests();

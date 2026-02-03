import { initializeDatabase, closeDatabase } from './index';
import { updateJobStatus } from './jobs';

async function fixStuckJob() {
  try {
    await initializeDatabase();
    console.log('✅ Connected to PostgreSQL');

    const jobId = 'dfaf298b-449b-4bf1-b735-e38c4504b0b3';
    
    await updateJobStatus(jobId, 'failed', {
      error_message: 'Job was stuck in running status - manually marked as failed'
    });

    console.log(`✅ Updated job ${jobId} from 'running' to 'failed'`);
    
    await closeDatabase();
    console.log('✅ Database closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixStuckJob();

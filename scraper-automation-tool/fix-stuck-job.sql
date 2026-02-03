-- Fix stuck job in running status
UPDATE jobs 
SET status = 'failed', 
    error_message = 'Job was stuck in running status - manually marked as failed'
WHERE id = 'dfaf298b-449b-4bf1-b735-e38c4504b0b3' 
  AND status = 'running';

import { beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase } from '../database';

beforeAll(async () => {
  await initializeDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

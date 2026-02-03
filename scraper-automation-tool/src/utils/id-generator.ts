import { randomUUID } from 'crypto';

export function generateJobId(): string {
  return randomUUID();
}

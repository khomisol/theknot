import type { SubmitJobRequest } from '../types/api';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSubmitJobRequest(body: any): ValidationResult {
  const errors: string[] = [];

  if (!body.site || typeof body.site !== 'string') {
    errors.push('site is required and must be a string');
  }

  if (!body.parameters || typeof body.parameters !== 'object') {
    errors.push('parameters is required and must be an object');
  }

  if (!body.format || !['csv', 'json'].includes(body.format)) {
    errors.push("format is required and must be 'csv' or 'json'");
  }

  if (body.webhook_url && typeof body.webhook_url !== 'string') {
    errors.push('webhook_url must be a string');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

import { writeFile } from 'fs/promises';
import type { ScrapedItem } from '../types/worker';

export async function exportToCSV(items: ScrapedItem[], filePath: string): Promise<void> {
  if (items.length === 0) {
    throw new Error('No items to export');
  }

  // Get all unique keys
  const keys = Array.from(new Set(items.flatMap((item) => Object.keys(item))));

  // Create CSV header
  const header = keys.join(',');

  // Create CSV rows with proper escaping
  const rows = items.map((item) => {
    return keys
      .map((key) => {
        const value = item[key];
        
        // Handle different value types
        if (value === null || value === undefined) {
          return '';
        }
        
        // Convert to string
        const strValue = String(value);
        
        // Always quote strings that contain special characters
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
          // Escape quotes by doubling them
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        
        return strValue;
      })
      .join(',');
  });

  const csv = [header, ...rows].join('\n');
  await writeFile(filePath, csv, 'utf-8');
}

export async function exportToJSON(items: ScrapedItem[], filePath: string): Promise<void> {
  const json = JSON.stringify(items, null, 2);
  await writeFile(filePath, json, 'utf-8');
}

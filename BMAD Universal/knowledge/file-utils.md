# File Utilities for Testing

> **Purpose**: Patterns for handling file operations in tests including CSV, XLSX, PDF, and ZIP file validation and generation.

---

## Common File Testing Scenarios

- Validating downloaded files
- Generating test data files
- Testing file upload functionality
- Comparing file contents

---

## Download Handling

### Capturing Downloads

```typescript
import { test, expect, Download } from '@playwright/test';

test('downloads report file', async ({ page }) => {
  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download');
  
  await page.click('[data-testid="download-report"]');
  
  const download = await downloadPromise;
  
  // Verify filename
  expect(download.suggestedFilename()).toBe('report.csv');
  
  // Save to disk for validation
  const path = await download.path();
  expect(path).toBeTruthy();
  
  // Or save to specific location
  await download.saveAs('./downloads/report.csv');
});
```

### Download Directory Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Set default download directory
    downloadsPath: './test-downloads',
  },
});
```

---

## CSV File Handling

### Reading CSV Files

```typescript
import * as fs from 'fs';
import * as path from 'path';

function parseCSV(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i]?.trim() || '';
      return obj;
    }, {} as Record<string, string>);
  });
}

test('downloaded CSV has correct data', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="export-csv"]');
  const download = await downloadPromise;
  
  const filePath = './downloads/export.csv';
  await download.saveAs(filePath);
  
  const data = parseCSV(filePath);
  
  expect(data.length).toBeGreaterThan(0);
  expect(data[0]).toHaveProperty('name');
  expect(data[0]).toHaveProperty('email');
});
```

### Generating CSV Test Data

```typescript
function generateCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(h => `"${row[h]}"`).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

test('uploads CSV file', async ({ page }) => {
  const testData = [
    { name: 'Alice', email: 'alice@test.com' },
    { name: 'Bob', email: 'bob@test.com' },
  ];
  
  const csvContent = generateCSV(testData);
  const filePath = './test-data/upload.csv';
  fs.writeFileSync(filePath, csvContent);
  
  await page.setInputFiles('[data-testid="file-input"]', filePath);
  await page.click('[data-testid="upload"]');
  
  await expect(page.getByText('2 records imported')).toBeVisible();
});
```

---

## Excel (XLSX) File Handling

### Reading Excel Files

```typescript
import * as XLSX from 'xlsx';

function readExcel(filePath: string): Record<string, any>[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  return XLSX.utils.sheet_to_json(sheet);
}

test('exported Excel has correct structure', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="export-excel"]');
  const download = await downloadPromise;
  
  const filePath = './downloads/report.xlsx';
  await download.saveAs(filePath);
  
  const data = readExcel(filePath);
  
  expect(data.length).toBe(10);
  expect(data[0]).toHaveProperty('Order ID');
  expect(data[0]).toHaveProperty('Total');
});
```

### Creating Excel Test Files

```typescript
function createExcel(data: Record<string, any>[], filePath: string) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
  XLSX.writeFile(workbook, filePath);
}

test('imports Excel file', async ({ page }) => {
  const testData = [
    { product: 'Widget', quantity: 10, price: 9.99 },
    { product: 'Gadget', quantity: 5, price: 19.99 },
  ];
  
  createExcel(testData, './test-data/import.xlsx');
  
  await page.setInputFiles('[data-testid="file-input"]', './test-data/import.xlsx');
  await page.click('[data-testid="import"]');
  
  await expect(page.getByText('2 products imported')).toBeVisible();
});
```

---

## PDF File Handling

### Validating PDF Downloads

```typescript
import * as fs from 'fs';
import pdf from 'pdf-parse';

async function extractPDFText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
}

test('generated PDF contains expected content', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="generate-invoice"]');
  const download = await downloadPromise;
  
  const filePath = './downloads/invoice.pdf';
  await download.saveAs(filePath);
  
  const text = await extractPDFText(filePath);
  
  expect(text).toContain('Invoice #12345');
  expect(text).toContain('Total: $99.99');
  expect(text).toContain('Thank you for your business');
});

async function getPDFPageCount(filePath: string): Promise<number> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.numpages;
}

test('report has correct page count', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="full-report"]');
  const download = await downloadPromise;
  
  await download.saveAs('./downloads/report.pdf');
  
  const pages = await getPDFPageCount('./downloads/report.pdf');
  expect(pages).toBeGreaterThan(1);
});
```

---

## ZIP File Handling

### Extracting and Validating ZIP Files

```typescript
import AdmZip from 'adm-zip';

function extractZip(filePath: string, extractTo: string): string[] {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(extractTo, true);
  
  return zip.getEntries().map(entry => entry.entryName);
}

test('downloaded archive contains expected files', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="download-archive"]');
  const download = await downloadPromise;
  
  const zipPath = './downloads/archive.zip';
  await download.saveAs(zipPath);
  
  const files = extractZip(zipPath, './downloads/extracted');
  
  expect(files).toContain('data.csv');
  expect(files).toContain('images/logo.png');
  expect(files).toContain('README.md');
});
```

### Creating ZIP Test Files

```typescript
function createZip(files: { name: string; content: string | Buffer }[]): Buffer {
  const zip = new AdmZip();
  
  for (const file of files) {
    zip.addFile(file.name, Buffer.from(file.content));
  }
  
  return zip.toBuffer();
}

test('uploads ZIP file with multiple files', async ({ page }) => {
  const zipBuffer = createZip([
    { name: 'data.json', content: JSON.stringify({ key: 'value' }) },
    { name: 'config.txt', content: 'setting=enabled' },
  ]);
  
  fs.writeFileSync('./test-data/upload.zip', zipBuffer);
  
  await page.setInputFiles('[data-testid="file-input"]', './test-data/upload.zip');
  await page.click('[data-testid="upload"]');
  
  await expect(page.getByText('2 files extracted')).toBeVisible();
});
```

---

## File Upload Testing

### Basic File Upload

```typescript
test('uploads single file', async ({ page }) => {
  await page.setInputFiles('[data-testid="file-input"]', './fixtures/test-image.png');
  
  await expect(page.getByText('test-image.png')).toBeVisible();
});
```

### Multiple File Upload

```typescript
test('uploads multiple files', async ({ page }) => {
  await page.setInputFiles('[data-testid="file-input"]', [
    './fixtures/doc1.pdf',
    './fixtures/doc2.pdf',
    './fixtures/doc3.pdf',
  ]);
  
  await expect(page.getByText('3 files selected')).toBeVisible();
});
```

### Drag and Drop Upload

```typescript
test('uploads via drag and drop', async ({ page }) => {
  const filePath = './fixtures/document.pdf';
  
  // Create DataTransfer event
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  
  // Add file to DataTransfer
  await page.dispatchEvent('[data-testid="drop-zone"]', 'drop', {
    dataTransfer,
  });
  
  // Alternative: Use setInputFiles on hidden input
  await page.setInputFiles('input[type="file"]', filePath);
});
```

---

## File Comparison

### Binary File Comparison

```typescript
import * as crypto from 'crypto';

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

test('downloaded file matches expected', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="download"]');
  const download = await downloadPromise;
  
  await download.saveAs('./downloads/actual.png');
  
  const expectedHash = getFileHash('./fixtures/expected.png');
  const actualHash = getFileHash('./downloads/actual.png');
  
  expect(actualHash).toBe(expectedHash);
});
```

### Text File Diff

```typescript
test('generated config matches expected', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="export-config"]');
  const download = await downloadPromise;
  
  await download.saveAs('./downloads/config.json');
  
  const actual = JSON.parse(fs.readFileSync('./downloads/config.json', 'utf-8'));
  const expected = JSON.parse(fs.readFileSync('./fixtures/expected-config.json', 'utf-8'));
  
  expect(actual).toEqual(expected);
});
```

---

## Cleanup Pattern

```typescript
// fixtures/file-utils.fixture.ts
import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
  tempDir: async ({}, use) => {
    const dir = `./temp-${Date.now()}`;
    fs.mkdirSync(dir, { recursive: true });
    
    await use(dir);
    
    // Cleanup after test
    fs.rmSync(dir, { recursive: true, force: true });
  },
});

// Usage
test('creates and cleans up files', async ({ page, tempDir }) => {
  const filePath = path.join(tempDir, 'test.csv');
  fs.writeFileSync(filePath, 'a,b,c');
  
  // Use file in test...
  // Directory auto-cleaned after test
});
```

---

## Related Knowledge

- [Data Factories](data-factories.md) - Generating test data
- [Visual Debugging](visual-debugging.md) - Artifact capture

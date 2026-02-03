# Error Handling in Tests

> **Purpose**: Patterns for testing error scenarios, capturing application errors, and validating error behavior without masking real bugs.

---

## Core Principles

1. **Test error paths** - Happy path isn't enough
2. **Don't swallow errors** - Catch intentionally, not defensively
3. **Validate error details** - Check messages, codes, context
4. **Fail fast on unexpected errors** - Let tests crash when appropriate

---

## Testing Expected Errors

### Async Error Assertions

```typescript
// Using Playwright's expect
test('rejects invalid email format', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', 'invalid-email');
  await page.click('[data-testid="submit"]');
  
  await expect(page.getByText('Invalid email format')).toBeVisible();
});

// Testing thrown errors
test('API client throws on 404', async ({ request }) => {
  await expect(
    request.get('/api/users/nonexistent')
  ).rejects.toThrow();
});
```

### Specific Error Messages

```typescript
test('shows specific validation error', async ({ page }) => {
  await page.goto('/form');
  await page.fill('[data-testid="password"]', '123');  // Too short
  await page.click('[data-testid="submit"]');
  
  const error = page.getByTestId('password-error');
  await expect(error).toBeVisible();
  await expect(error).toContainText('at least 8 characters');
});
```

---

## API Error Testing

### Testing Error Responses

```typescript
test('handles 400 Bad Request', async ({ page }) => {
  await page.route('**/api/submit', (route) => {
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'ValidationError',
        message: 'Name is required',
        field: 'name',
      }),
    });
  });
  
  await page.goto('/form');
  await page.click('[data-testid="submit"]');
  
  await expect(page.getByText('Name is required')).toBeVisible();
});

test('handles 500 Server Error gracefully', async ({ page }) => {
  await page.route('**/api/data', (route) => {
    route.fulfill({ status: 500 });
  });
  
  await page.goto('/dashboard');
  
  await expect(page.getByText('Something went wrong')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```

### Network Error Testing

```typescript
test('handles network failure', async ({ page }) => {
  await page.route('**/api/**', (route) => {
    route.abort('failed');
  });
  
  await page.goto('/app');
  
  await expect(page.getByText('Network error')).toBeVisible();
});

test('handles timeout', async ({ page }) => {
  await page.route('**/api/slow', async (route) => {
    // Never respond - simulates timeout
    await new Promise(() => {});
  });
  
  await page.goto('/app');
  await page.click('[data-testid="load-data"]');
  
  await expect(page.getByText('Request timed out')).toBeVisible({ timeout: 35000 });
});
```

---

## JavaScript Error Detection

### Capturing Console Errors

```typescript
test('detects console errors', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.goto('/app');
  await page.click('[data-testid="buggy-button"]');
  
  // Assert no unexpected console errors
  expect(errors).toHaveLength(0);
});
```

### Capturing Page Errors

```typescript
test('no JavaScript errors on page', async ({ page }) => {
  const pageErrors: Error[] = [];
  
  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });
  
  await page.goto('/app');
  await page.click('[data-testid="action"]');
  
  expect(pageErrors).toHaveLength(0);
});
```

### Error Boundary Testing

```typescript
test('error boundary catches rendering errors', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (e) => pageErrors.push(e));
  
  await page.goto('/app?triggerError=true');
  
  // Error boundary should show fallback
  await expect(page.getByText('Something went wrong')).toBeVisible();
  
  // Verify recovery option exists
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  
  // Error was caught, not thrown to page
  expect(pageErrors).toHaveLength(0);
});
```

---

## Form Validation Errors

### Field-Level Validation

```typescript
test.describe('form validation', () => {
  test('shows errors for all invalid fields', async ({ page }) => {
    await page.goto('/registration');
    
    // Submit empty form
    await page.click('[data-testid="submit"]');
    
    // Check all validation messages
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('clears error when field is corrected', async ({ page }) => {
    await page.goto('/registration');
    
    await page.fill('[data-testid="email"]', 'invalid');
    await page.click('[data-testid="submit"]');
    
    await expect(page.getByText('Invalid email format')).toBeVisible();
    
    // Correct the field
    await page.fill('[data-testid="email"]', 'valid@example.com');
    await page.click('[data-testid="submit"]');
    
    await expect(page.getByText('Invalid email format')).not.toBeVisible();
  });
});
```

### Inline vs Summary Errors

```typescript
test('shows error summary at top of form', async ({ page }) => {
  await page.goto('/long-form');
  await page.click('[data-testid="submit"]');
  
  const summary = page.getByRole('alert');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('Please fix 3 errors');
  
  // Summary links to fields
  await summary.getByRole('link', { name: 'Email' }).click();
  await expect(page.getByLabel('Email')).toBeFocused();
});
```

---

## Error Recovery Testing

### Retry Mechanisms

```typescript
test('retry button re-attempts failed request', async ({ page }) => {
  let attempts = 0;
  
  await page.route('**/api/data', (route) => {
    attempts++;
    if (attempts < 2) {
      route.fulfill({ status: 500 });
    } else {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'success' }),
      });
    }
  });
  
  await page.goto('/dashboard');
  
  // First attempt fails
  await expect(page.getByText('Failed to load')).toBeVisible();
  
  // Retry succeeds
  await page.click('[data-testid="retry"]');
  await expect(page.getByText('success')).toBeVisible();
});
```

### State Recovery

```typescript
test('preserves form data after error', async ({ page }) => {
  await page.route('**/api/submit', (route) => {
    route.fulfill({ status: 500 });
  });
  
  await page.goto('/form');
  await page.fill('[data-testid="name"]', 'John Doe');
  await page.fill('[data-testid="email"]', 'john@example.com');
  await page.click('[data-testid="submit"]');
  
  // Error shown but form data preserved
  await expect(page.getByText('Server error')).toBeVisible();
  await expect(page.getByTestId('name')).toHaveValue('John Doe');
  await expect(page.getByTestId('email')).toHaveValue('john@example.com');
});
```

---

## Error Fixtures

### Global Error Capture

```typescript
// fixtures/error-capture.fixture.ts
import { test as base, Page } from '@playwright/test';

type ErrorCapture = {
  consoleErrors: string[];
  pageErrors: Error[];
  networkErrors: string[];
};

export const test = base.extend<{ errorCapture: ErrorCapture }>({
  errorCapture: async ({ page }, use) => {
    const capture: ErrorCapture = {
      consoleErrors: [],
      pageErrors: [],
      networkErrors: [],
    };
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        capture.consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      capture.pageErrors.push(error);
    });
    
    page.on('requestfailed', (request) => {
      capture.networkErrors.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    
    await use(capture);
  },
});

// Usage
test('page has no errors', async ({ page, errorCapture }) => {
  await page.goto('/app');
  await page.click('[data-testid="action"]');
  
  expect(errorCapture.pageErrors).toHaveLength(0);
  expect(errorCapture.consoleErrors).toHaveLength(0);
});
```

---

## Anti-Patterns

```typescript
// ❌ Swallowing errors
try {
  await page.click('[data-testid="button"]');
} catch (e) {
  // Silently ignore - BAD!
}

// ❌ Too broad error handling
test('handles errors', async ({ page }) => {
  try {
    await page.goto('/app');
    // ... test code
  } catch {
    // Any error = pass - BAD!
    expect(true).toBe(true);
  }
});

// ✅ Specific error expectations
test('handles specific error', async ({ page }) => {
  await page.route('**/api/data', (r) => r.fulfill({ status: 500 }));
  await page.goto('/app');
  
  await expect(page.getByRole('alert')).toContainText('Server error');
});
```

---

## Error Testing Checklist

- [ ] Test validation errors for all required fields
- [ ] Test API error responses (400, 401, 403, 404, 500)
- [ ] Test network failures and timeouts
- [ ] Verify error messages are user-friendly
- [ ] Test error recovery mechanisms
- [ ] Ensure errors don't leak sensitive info
- [ ] Check accessibility of error messages
- [ ] Capture unexpected JS errors in tests

---

## Related Knowledge

- [Network First](network-first.md) - Mocking error responses
- [Test Healing Patterns](test-healing-patterns.md) - Handling flaky errors
- [Visual Debugging](visual-debugging.md) - Investigating failures

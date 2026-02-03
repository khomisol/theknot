# Email Authentication Testing

> **Purpose**: Patterns for testing email-based authentication flows including magic links, OTP codes, and verification emails.

---

## Core Challenge

Email authentication flows require:
1. Triggering email send from application
2. Receiving email in test environment
3. Extracting authentication data (links, codes)
4. Completing auth flow before timeout

---

## Email Testing Services

### Mailosaur (Recommended)

```typescript
// fixtures/email.fixture.ts
import Mailosaur from 'mailosaur';

const mailosaur = new Mailosaur(process.env.MAILOSAUR_API_KEY!);
const serverId = process.env.MAILOSAUR_SERVER_ID!;

export async function waitForEmail(emailAddress: string, subject?: string) {
  const email = await mailosaur.messages.get(serverId, {
    sentTo: emailAddress,
    subject: subject,
  }, {
    timeout: 30000, // 30 second timeout
  });
  
  return email;
}

export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `test-${timestamp}@${serverId}.mailosaur.net`;
}
```

### MailSlurp Alternative

```typescript
import { MailSlurp } from 'mailslurp-client';

const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! });

export async function createInbox() {
  const inbox = await mailslurp.createInbox();
  return {
    email: inbox.emailAddress,
    inboxId: inbox.id,
  };
}

export async function waitForEmail(inboxId: string, timeout = 30000) {
  return await mailslurp.waitForLatestEmail(inboxId, timeout);
}
```

---

## Magic Link Testing

### Complete Flow Example

```typescript
// tests/auth/magic-link.spec.ts
import { test, expect } from '@playwright/test';
import { generateTestEmail, waitForEmail } from '../fixtures/email.fixture';

test('magic link authentication flow', async ({ page }) => {
  const testEmail = generateTestEmail();
  
  // Step 1: Request magic link
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', testEmail);
  await page.click('[data-testid="send-magic-link"]');
  
  // Step 2: Wait for confirmation UI
  await expect(page.getByText('Check your email')).toBeVisible();
  
  // Step 3: Retrieve email
  const email = await waitForEmail(testEmail, 'Sign in to');
  
  // Step 4: Extract magic link
  const magicLink = extractLink(email.html.body, '/auth/verify');
  expect(magicLink).toBeTruthy();
  
  // Step 5: Complete authentication
  await page.goto(magicLink);
  
  // Step 6: Verify authenticated state
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByTestId('user-menu')).toBeVisible();
});

function extractLink(html: string, pathContains: string): string | null {
  const linkRegex = /href="([^"]*)/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1].includes(pathContains)) {
      return match[1];
    }
  }
  return null;
}
```

---

## OTP Code Testing

### SMS/Email OTP Pattern

```typescript
test('OTP verification flow', async ({ page }) => {
  const testEmail = generateTestEmail();
  
  // Request OTP
  await page.goto('/verify');
  await page.fill('[data-testid="email"]', testEmail);
  await page.click('[data-testid="send-otp"]');
  
  // Get OTP from email
  const email = await waitForEmail(testEmail, 'Your verification code');
  const otpCode = extractOTP(email.text.body);
  
  // Enter OTP
  await page.fill('[data-testid="otp-input"]', otpCode);
  await page.click('[data-testid="verify-button"]');
  
  await expect(page).toHaveURL('/dashboard');
});

function extractOTP(text: string): string {
  // Match 6-digit code
  const match = text.match(/\b(\d{6})\b/);
  if (!match) throw new Error('OTP not found in email');
  return match[1];
}
```

---

## Session Caching for Email Auth

### Avoid Repeated Email Flows

```typescript
// global-setup.ts
import { chromium } from '@playwright/test';
import { generateTestEmail, waitForEmail } from './fixtures/email.fixture';

async function globalSetup() {
  // Only do email auth once per test run
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const testEmail = generateTestEmail();
  
  // Complete magic link flow
  await page.goto('/login');
  await page.fill('[data-testid="email"]', testEmail);
  await page.click('[data-testid="send-magic-link"]');
  
  const email = await waitForEmail(testEmail);
  const magicLink = extractLink(email.html.body, '/auth/verify');
  await page.goto(magicLink);
  
  // Save authenticated state for all tests
  await page.context().storageState({ path: './auth/email-user.json' });
  
  await browser.close();
}
```

---

## Verification Email Testing

### Account Verification Flow

```typescript
test('email verification during signup', async ({ page }) => {
  const testEmail = generateTestEmail();
  
  // Complete signup
  await page.goto('/signup');
  await page.fill('[data-testid="email"]', testEmail);
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="signup-button"]');
  
  // Check pending verification state
  await expect(page.getByText('Verify your email')).toBeVisible();
  
  // Get verification email
  const email = await waitForEmail(testEmail, 'Verify your email');
  const verifyLink = extractLink(email.html.body, '/verify-email');
  
  // Complete verification
  await page.goto(verifyLink);
  await expect(page.getByText('Email verified')).toBeVisible();
  
  // Verify can now access protected features
  await page.goto('/dashboard');
  await expect(page.getByTestId('full-access-feature')).toBeVisible();
});
```

---

## Password Reset Testing

```typescript
test('password reset via email', async ({ page }) => {
  const testEmail = generateTestEmail();
  const newPassword = 'NewSecurePass456!';
  
  // First create account (or use existing test account)
  await createTestAccount(testEmail, 'OldPass123!');
  
  // Request password reset
  await page.goto('/forgot-password');
  await page.fill('[data-testid="email"]', testEmail);
  await page.click('[data-testid="reset-button"]');
  
  // Get reset email
  const email = await waitForEmail(testEmail, 'Reset your password');
  const resetLink = extractLink(email.html.body, '/reset-password');
  
  // Set new password
  await page.goto(resetLink);
  await page.fill('[data-testid="new-password"]', newPassword);
  await page.fill('[data-testid="confirm-password"]', newPassword);
  await page.click('[data-testid="submit"]');
  
  // Verify can login with new password
  await page.goto('/login');
  await page.fill('[data-testid="email"]', testEmail);
  await page.fill('[data-testid="password"]', newPassword);
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Best Practices

### Email Content Validation

```typescript
test('verification email contains required elements', async ({ page }) => {
  const testEmail = generateTestEmail();
  
  await triggerVerificationEmail(page, testEmail);
  const email = await waitForEmail(testEmail);
  
  // Validate email structure
  expect(email.subject).toContain('Verify');
  expect(email.from[0].email).toBe('noreply@yourapp.com');
  
  // Validate content
  expect(email.html.body).toContain('Verify your email');
  expect(email.html.body).toMatch(/href="[^"]*verify/);
  
  // Validate link is HTTPS
  const link = extractLink(email.html.body, '/verify');
  expect(link).toMatch(/^https:\/\//);
});
```

### Link Expiration Testing

```typescript
test('magic link expires after timeout', async ({ page }) => {
  const testEmail = generateTestEmail();
  
  await page.goto('/login');
  await page.fill('[data-testid="email"]', testEmail);
  await page.click('[data-testid="send-magic-link"]');
  
  const email = await waitForEmail(testEmail);
  const magicLink = extractLink(email.html.body, '/auth/verify');
  
  // Wait for link to expire (in test env, set short expiry)
  await page.waitForTimeout(parseInt(process.env.MAGIC_LINK_EXPIRY_MS!) + 1000);
  
  // Attempt to use expired link
  await page.goto(magicLink);
  
  await expect(page.getByText('Link expired')).toBeVisible();
});
```

---

## Cleanup

```typescript
// fixtures/email.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  emailFixture: async ({}, use) => {
    const createdEmails: string[] = [];
    
    const fixture = {
      generate: () => {
        const email = generateTestEmail();
        createdEmails.push(email);
        return email;
      },
      waitFor: waitForEmail,
    };
    
    await use(fixture);
    
    // Cleanup: delete test emails after test
    for (const email of createdEmails) {
      await mailosaur.messages.deleteAll(serverId, { sentTo: email });
    }
  },
});
```

---

## Related Knowledge

- [Auth Session](auth-session.md) - Session reuse patterns
- [Network First](network-first.md) - API-based auth setup
- [Data Factories](data-factories.md) - Creating test accounts

# Selector Resilience

> **Purpose**: Patterns for creating stable, maintainable selectors that resist UI changes and reduce test flakiness.

---

## Selector Priority Hierarchy

### Recommended Order (Most to Least Stable)

1. **`data-testid`** - Explicit test hooks
2. **ARIA roles/labels** - Accessibility attributes
3. **Text content** - User-visible text
4. **Semantic HTML** - Element types with meaning
5. **CSS classes** - Styling identifiers (least stable)

---

## 1. Test ID Selectors (Highest Priority)

### Implementation Pattern

```typescript
// Component implementation
<button data-testid="submit-order">Place Order</button>

// Test usage
await page.getByTestId('submit-order').click();
```

### Naming Conventions

```typescript
// Good: descriptive, hierarchical
data-testid="checkout-submit-button"
data-testid="user-profile-avatar"
data-testid="cart-item-quantity-input"

// Bad: generic, positional
data-testid="button-1"
data-testid="input"
data-testid="div-wrapper"
```

### When to Add Test IDs

- Interactive elements (buttons, inputs, links)
- Dynamic content areas
- List items and their children
- Modal dialogs and overlays
- Navigation elements

---

## 2. ARIA/Role Selectors

### Built-in Accessibility

```typescript
// Button with accessible name
await page.getByRole('button', { name: 'Submit' }).click();

// Link by text
await page.getByRole('link', { name: 'Home' }).click();

// Input by label
await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');

// Checkbox
await page.getByRole('checkbox', { name: 'Remember me' }).check();

// Combobox/Select
await page.getByRole('combobox', { name: 'Country' }).selectOption('USA');
```

### Common Roles

```typescript
// Navigation
page.getByRole('navigation')
page.getByRole('banner')  // header
page.getByRole('main')
page.getByRole('contentinfo')  // footer

// Interactive
page.getByRole('button')
page.getByRole('link')
page.getByRole('textbox')
page.getByRole('checkbox')
page.getByRole('radio')

// Structural
page.getByRole('heading', { level: 1 })
page.getByRole('list')
page.getByRole('listitem')
page.getByRole('table')
page.getByRole('row')
page.getByRole('cell')
```

---

## 3. Text Selectors

### Exact vs Partial Match

```typescript
// Exact match
await page.getByText('Submit Order', { exact: true }).click();

// Partial match (default)
await page.getByText('Submit').click();

// Case insensitive
await page.getByText(/submit order/i).click();
```

### Label-Based Selection

```typescript
// Input by associated label
await page.getByLabel('Email address').fill('test@example.com');

// Checkbox by label
await page.getByLabel('I agree to terms').check();
```

### Placeholder Text

```typescript
await page.getByPlaceholder('Enter your email').fill('test@example.com');
```

---

## 4. Semantic HTML Selectors

### Form Elements

```typescript
// Form by name
page.locator('form[name="checkout"]')

// Input by type
page.locator('input[type="email"]')

// Submit button
page.locator('button[type="submit"]')
```

### Structural Elements

```typescript
// Header
page.locator('header')

// Main content
page.locator('main')

// Article
page.locator('article')
```

---

## 5. CSS Selectors (Use Sparingly)

### When CSS is Necessary

```typescript
// Complex structural queries
page.locator('.card:has([data-testid="featured"]) .price')

// Nth-child when order matters
page.locator('.menu-item:nth-child(3)')

// Sibling relationships
page.locator('[data-testid="error"] + .help-text')
```

### Avoid Fragile CSS

```typescript
// ❌ Fragile: depends on nesting
page.locator('.container > div > div > button')

// ❌ Fragile: utility classes change
page.locator('.mt-4.px-2.text-blue-500')

// ❌ Fragile: auto-generated classes
page.locator('.Button__StyledButton-sc-1234')

// ✅ Better: meaningful classes if needed
page.locator('.checkout-form .submit-button')
```

---

## Chaining and Filtering

### Scoped Selectors

```typescript
// Scope to container
const card = page.getByTestId('product-card').first();
await card.getByRole('button', { name: 'Add to Cart' }).click();

// Filter by multiple criteria
await page.getByRole('row')
  .filter({ hasText: 'Pending' })
  .getByRole('button', { name: 'View' })
  .click();
```

### Has/HasNot Filters

```typescript
// Row that has a specific status
await page.getByRole('row')
  .filter({ has: page.getByText('Active') })
  .click();

// Card without sold-out badge
await page.locator('.product-card')
  .filter({ hasNot: page.getByText('Sold Out') })
  .first()
  .click();
```

---

## List and Table Patterns

### Iterating Collections

```typescript
// Get all items
const items = page.getByTestId('cart-item');
const count = await items.count();

// Process each
for (let i = 0; i < count; i++) {
  const name = await items.nth(i).getByTestId('item-name').textContent();
  console.log(name);
}

// Find specific item
await page.getByTestId('cart-item')
  .filter({ hasText: 'Blue Widget' })
  .getByRole('button', { name: 'Remove' })
  .click();
```

### Table Cells

```typescript
// Get cell by row and column
async function getTableCell(page: Page, rowText: string, columnHeader: string) {
  const headers = await page.getByRole('columnheader').allTextContents();
  const colIndex = headers.indexOf(columnHeader);
  
  return page.getByRole('row')
    .filter({ hasText: rowText })
    .getByRole('cell')
    .nth(colIndex);
}

const statusCell = await getTableCell(page, 'Order #123', 'Status');
await expect(statusCell).toHaveText('Shipped');
```

---

## Frame and Shadow DOM

### iFrames

```typescript
// Locate frame first
const frame = page.frameLocator('#payment-iframe');
await frame.getByTestId('card-number').fill('4242424242424242');
```

### Shadow DOM

```typescript
// Playwright pierces shadow DOM by default with >> operator
await page.locator('custom-element >> button').click();

// Or explicit
await page.locator('custom-element').locator('button').click();
```

---

## Selector Debugging

### Inspect Locators

```typescript
// Check what matched
const locator = page.getByTestId('submit');
console.log('Count:', await locator.count());
console.log('Text:', await locator.textContent());
console.log('Visible:', await locator.isVisible());
```

### Use Playwright Inspector

```bash
# Launch with inspector
npx playwright test --debug

# Use "Pick Locator" tool to find best selector
```

### Highlight Elements

```typescript
// During debugging
await page.getByTestId('target').highlight();
```

---

## Anti-Patterns

```typescript
// ❌ Avoid: XPath (verbose, fragile)
page.locator('//div[@class="card"]/button')

// ❌ Avoid: Index-based without context
page.locator('button').nth(3)

// ❌ Avoid: Generated class names
page.locator('.MuiButton-root-123')

// ❌ Avoid: Deep nesting
page.locator('div > div > div > span > button')

// ❌ Avoid: Inline styles
page.locator('[style*="color: red"]')
```

---

## Selector Maintenance

### Page Object Pattern

```typescript
// pages/checkout.page.ts
export class CheckoutPage {
  readonly page: Page;
  
  // Centralized selectors
  readonly submitButton: Locator;
  readonly emailInput: Locator;
  readonly totalAmount: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByTestId('checkout-submit');
    this.emailInput = page.getByLabel('Email address');
    this.totalAmount = page.getByTestId('order-total');
  }
  
  async completeCheckout(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
```

### Component Locator Pattern

```typescript
// components/product-card.ts
export function productCard(page: Page, productName: string) {
  const card = page.getByTestId('product-card')
    .filter({ hasText: productName });
  
  return {
    root: card,
    title: card.getByTestId('product-title'),
    price: card.getByTestId('product-price'),
    addToCart: card.getByRole('button', { name: 'Add to Cart' }),
    
    async add() {
      await this.addToCart.click();
    },
  };
}

// Usage
const widget = productCard(page, 'Blue Widget');
await widget.add();
```

---

## Checklist

- [ ] Prefer `getByTestId` for interactive elements
- [ ] Use `getByRole` with accessible names
- [ ] Reserve CSS selectors for edge cases
- [ ] Avoid auto-generated class names
- [ ] Centralize selectors in Page Objects
- [ ] Test selectors work in multiple browsers
- [ ] Document any non-obvious selector choices

---

## Related Knowledge

- [Test Healing Patterns](test-healing-patterns.md) - Fallback selector strategies
- [Fixture Architecture](fixture-architecture.md) - Organizing test utilities

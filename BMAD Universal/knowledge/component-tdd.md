# Component TDD

> **Purpose**: Test-Driven Development patterns for component testing with Red-Green-Refactor cycle, accessibility assertions, and provider isolation.

---

## TDD Fundamentals

### The Red-Green-Refactor Cycle

```
1. RED    → Write a failing test
2. GREEN  → Write minimal code to pass
3. REFACTOR → Improve code, keep tests green
4. REPEAT
```

### Benefits for Component Development

- **Design clarity** - Tests define component API
- **Confidence** - Refactor fearlessly
- **Documentation** - Tests show usage examples
- **Accessibility** - Build a11y in from start

---

## Component Test Setup

### Playwright Component Testing

```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/components',
  use: {
    ctPort: 3100,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
```

### Basic Component Test

```typescript
// tests/components/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/Button';

test.describe('Button Component', () => {
  test('renders with text', async ({ mount }) => {
    const component = await mount(<Button>Click me</Button>);
    
    await expect(component).toContainText('Click me');
  });

  test('handles click events', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <Button onClick={() => { clicked = true; }}>Click me</Button>
    );
    
    await component.click();
    
    expect(clicked).toBe(true);
  });
});
```

---

## TDD Example: Building a Search Input

### Step 1: RED - Write Failing Test

```typescript
// tests/components/SearchInput.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { SearchInput } from '../../src/components/SearchInput';

test('renders search input with placeholder', async ({ mount }) => {
  const component = await mount(<SearchInput placeholder="Search..." />);
  
  await expect(component.getByRole('searchbox')).toHaveAttribute(
    'placeholder', 
    'Search...'
  );
});
```

### Step 2: GREEN - Minimal Implementation

```typescript
// src/components/SearchInput.tsx
export function SearchInput({ placeholder }: { placeholder: string }) {
  return <input type="search" placeholder={placeholder} />;
}
```

### Step 3: RED - Add More Behavior

```typescript
test('calls onSearch when Enter pressed', async ({ mount }) => {
  let searchTerm = '';
  const component = await mount(
    <SearchInput 
      placeholder="Search..." 
      onSearch={(term) => { searchTerm = term; }}
    />
  );
  
  await component.getByRole('searchbox').fill('hello');
  await component.getByRole('searchbox').press('Enter');
  
  expect(searchTerm).toBe('hello');
});
```

### Step 4: GREEN - Add Handler

```typescript
// src/components/SearchInput.tsx
interface SearchInputProps {
  placeholder: string;
  onSearch?: (term: string) => void;
}

export function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(e.currentTarget.value);
    }
  };

  return (
    <input 
      type="search" 
      placeholder={placeholder} 
      onKeyDown={handleKeyDown}
    />
  );
}
```

### Step 5: REFACTOR - Improve Code

```typescript
// src/components/SearchInput.tsx
export function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  };

  return (
    <input 
      type="search" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
    />
  );
}
```

---

## Accessibility-First TDD

### Start with A11y Tests

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dialog Component A11y', () => {
  test('has no accessibility violations', async ({ mount, page }) => {
    await mount(
      <Dialog open={true} title="Confirm">
        <p>Are you sure?</p>
        <button>Yes</button>
        <button>No</button>
      </Dialog>
    );
    
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('traps focus within dialog', async ({ mount }) => {
    const component = await mount(
      <Dialog open={true} title="Confirm">
        <button>First</button>
        <button>Last</button>
      </Dialog>
    );
    
    // Focus should be trapped
    await component.getByRole('button', { name: 'Last' }).focus();
    await component.press('Tab');
    
    await expect(component.getByRole('button', { name: 'First' })).toBeFocused();
  });

  test('closes on Escape key', async ({ mount }) => {
    let closed = false;
    const component = await mount(
      <Dialog open={true} onClose={() => { closed = true; }}>
        Content
      </Dialog>
    );
    
    await component.press('Escape');
    
    expect(closed).toBe(true);
  });
});
```

### Semantic Role Testing

```typescript
test('uses correct ARIA roles', async ({ mount }) => {
  const component = await mount(
    <Tabs defaultTab="tab1">
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
      </TabList>
      <TabPanel tabId="tab1">Content 1</TabPanel>
      <TabPanel tabId="tab2">Content 2</TabPanel>
    </Tabs>
  );
  
  // Verify roles
  await expect(component.getByRole('tablist')).toBeVisible();
  await expect(component.getByRole('tab')).toHaveCount(2);
  await expect(component.getByRole('tabpanel')).toBeVisible();
  
  // Verify active state
  await expect(component.getByRole('tab', { name: 'Tab 1' }))
    .toHaveAttribute('aria-selected', 'true');
});
```

---

## Provider Isolation

### Mock Context Providers

```typescript
// tests/fixtures/providers.tsx
import { ReactNode } from 'react';

interface MockProviderProps {
  children: ReactNode;
  user?: { name: string; role: string };
  theme?: 'light' | 'dark';
}

export function MockProviders({ children, user, theme = 'light' }: MockProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user || null}>
        {children}
      </UserContext.Provider>
    </ThemeProvider>
  );
}
```

### Using Mock Providers in Tests

```typescript
test('shows admin controls for admin users', async ({ mount }) => {
  const component = await mount(
    <MockProviders user={{ name: 'Admin', role: 'admin' }}>
      <Dashboard />
    </MockProviders>
  );
  
  await expect(component.getByTestId('admin-panel')).toBeVisible();
});

test('hides admin controls for regular users', async ({ mount }) => {
  const component = await mount(
    <MockProviders user={{ name: 'User', role: 'user' }}>
      <Dashboard />
    </MockProviders>
  );
  
  await expect(component.getByTestId('admin-panel')).not.toBeVisible();
});
```

### API Mocking in Components

```typescript
test('loads and displays data', async ({ mount, page }) => {
  // Mock API response
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      json: [
        { id: 1, name: 'Widget', price: 9.99 },
        { id: 2, name: 'Gadget', price: 19.99 },
      ],
    });
  });
  
  const component = await mount(<ProductList />);
  
  await expect(component.getByText('Widget')).toBeVisible();
  await expect(component.getByText('$9.99')).toBeVisible();
});
```

---

## State Management Testing

### Testing Controlled Components

```typescript
test('controlled input reflects external value', async ({ mount }) => {
  let currentValue = 'initial';
  
  const component = await mount(
    <Input 
      value={currentValue}
      onChange={(v) => { currentValue = v; }}
    />
  );
  
  await expect(component.getByRole('textbox')).toHaveValue('initial');
  
  // Simulating external state change requires remount
  await component.update(
    <Input value="updated" onChange={(v) => { currentValue = v; }} />
  );
  
  await expect(component.getByRole('textbox')).toHaveValue('updated');
});
```

### Testing Uncontrolled Components

```typescript
test('uncontrolled input manages own state', async ({ mount }) => {
  const component = await mount(<Input defaultValue="initial" />);
  
  const input = component.getByRole('textbox');
  
  await expect(input).toHaveValue('initial');
  await input.fill('changed');
  await expect(input).toHaveValue('changed');
});
```

---

## Visual Regression Testing

### Snapshot Testing

```typescript
test('matches visual snapshot', async ({ mount }) => {
  const component = await mount(
    <Card title="Product">
      <p>Description</p>
      <button>Buy Now</button>
    </Card>
  );
  
  await expect(component).toHaveScreenshot('card-default.png');
});

test('matches snapshot in hover state', async ({ mount }) => {
  const component = await mount(<Button>Hover me</Button>);
  
  await component.hover();
  
  await expect(component).toHaveScreenshot('button-hover.png');
});
```

---

## Test Organization

### Feature-Based Structure

```
src/
  components/
    Button/
      Button.tsx
      Button.spec.tsx      # Component tests
      Button.stories.tsx   # Storybook (optional)
    SearchInput/
      SearchInput.tsx
      SearchInput.spec.tsx
```

### Describe Block Organization

```typescript
test.describe('SearchInput', () => {
  test.describe('rendering', () => {
    test('displays placeholder', async ({ mount }) => { /* ... */ });
    test('displays initial value', async ({ mount }) => { /* ... */ });
  });

  test.describe('interactions', () => {
    test('updates value on input', async ({ mount }) => { /* ... */ });
    test('calls onSearch on Enter', async ({ mount }) => { /* ... */ });
    test('calls onSearch on button click', async ({ mount }) => { /* ... */ });
  });

  test.describe('accessibility', () => {
    test('has no a11y violations', async ({ mount }) => { /* ... */ });
    test('supports keyboard navigation', async ({ mount }) => { /* ... */ });
  });
});
```

---

## TDD Checklist

- [ ] Write failing test first
- [ ] Write minimal code to pass
- [ ] Refactor while keeping tests green
- [ ] Include accessibility tests early
- [ ] Test component API, not implementation
- [ ] Mock external dependencies
- [ ] Test edge cases and error states
- [ ] Add visual regression tests for UI

---

## Related Knowledge

- [Test Levels](test-levels.md) - Where component tests fit
- [Fixture Architecture](fixture-architecture.md) - Test fixtures
- [Selector Resilience](selector-resilience.md) - Finding elements

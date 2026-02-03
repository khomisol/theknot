# Contract Testing

> **Purpose**: Consumer-driven contract testing patterns using Pact to ensure API compatibility between services without requiring full integration environments.

---

## Why Contract Testing?

### The Integration Testing Problem

- Full integration tests are slow and flaky
- Mocking APIs can drift from reality
- Breaking changes discovered too late
- Microservices multiply the problem

### Contract Testing Benefits

- **Fast feedback** - No network, no deployments
- **Accurate mocks** - Contracts enforce reality
- **Independent deployments** - Verify before merge
- **Clear ownership** - Consumer defines expectations

---

## Contract Testing Flow

```
1. Consumer writes tests → Generates contract (Pact file)
2. Contract uploaded to Pact Broker
3. Provider verifies contract against real implementation
4. Both sides green → Safe to deploy
```

---

## Consumer Side (Frontend/Client)

### Basic Consumer Test

```typescript
// tests/contracts/user-api.consumer.spec.ts
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
const { like, eachLike, string, integer } = MatchersV3;

const provider = new PactV3({
  consumer: 'WebApp',
  provider: 'UserService',
  dir: './pacts',
});

describe('User API Contract', () => {
  it('returns user by ID', async () => {
    // Define expected interaction
    await provider
      .given('user 123 exists')
      .uponReceiving('a request for user 123')
      .withRequest({
        method: 'GET',
        path: '/api/users/123',
        headers: {
          Authorization: like('Bearer token'),
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          id: integer(123),
          name: string('John Doe'),
          email: string('john@example.com'),
          roles: eachLike('admin'),
        },
      });

    // Execute test with mock provider
    await provider.executeTest(async (mockServer) => {
      const client = new UserApiClient(mockServer.url);
      const user = await client.getUser(123);
      
      expect(user.id).toBe(123);
      expect(user.name).toBeDefined();
      expect(user.email).toContain('@');
    });
  });
});
```

### Flexible Matchers

```typescript
import { MatchersV3 } from '@pact-foundation/pact';
const { 
  like,           // Match type, not exact value
  eachLike,       // Array with at least one matching element
  string,         // String type
  integer,        // Integer type
  decimal,        // Decimal type
  boolean,        // Boolean type
  datetime,       // ISO datetime format
  uuid,           // UUID format
  regex,          // Custom regex pattern
} = MatchersV3;

// Complex matching example
const userResponse = {
  id: uuid(),
  name: string('Test User'),
  email: regex('test@example.com', '^[\\w.-]+@[\\w.-]+\\.\\w+$'),
  createdAt: datetime("yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
  settings: like({
    theme: 'dark',
    notifications: true,
  }),
  orders: eachLike({
    id: integer(),
    total: decimal(99.99),
    status: string('pending'),
  }),
};
```

---

## Provider Side (Backend/API)

### Provider Verification

```typescript
// tests/contracts/user-api.provider.spec.ts
import { Verifier } from '@pact-foundation/pact';
import { app } from '../src/app';  // Your Express/Fastify app

describe('User API Provider Verification', () => {
  let server: Server;
  
  beforeAll(async () => {
    server = app.listen(4000);
  });
  
  afterAll(async () => {
    server.close();
  });

  it('validates contracts', async () => {
    const verifier = new Verifier({
      providerBaseUrl: 'http://localhost:4000',
      provider: 'UserService',
      
      // Option 1: Local pact files
      pactUrls: ['./pacts/WebApp-UserService.json'],
      
      // Option 2: Pact Broker
      // pactBrokerUrl: 'https://your-broker.pactflow.io',
      // pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      
      // State handlers - setup test data
      stateHandlers: {
        'user 123 exists': async () => {
          await db.users.create({ id: 123, name: 'John Doe', email: 'john@example.com' });
        },
        'no users exist': async () => {
          await db.users.deleteAll();
        },
      },
      
      // Request filters
      requestFilter: (req) => {
        req.headers['Authorization'] = 'Bearer test-token';
        return req;
      },
    });

    await verifier.verifyProvider();
  });
});
```

### State Management

```typescript
// Detailed state handlers
const stateHandlers = {
  // Simple state
  'user 123 exists': async () => {
    await seedUser({ id: 123 });
  },
  
  // State with parameters
  'user exists': async (params: { id: number; name: string }) => {
    await seedUser({ id: params.id, name: params.name });
  },
  
  // Complex state
  'user 123 has 3 orders': async () => {
    await seedUser({ id: 123 });
    await seedOrders({ userId: 123, count: 3 });
  },
  
  // Cleanup state
  'clean database': async () => {
    await db.truncateAll();
  },
};
```

---

## Pact Broker Integration

### Publishing Contracts

```typescript
// scripts/publish-pacts.ts
import { Publisher } from '@pact-foundation/pact';

new Publisher({
  pactBroker: 'https://your-broker.pactflow.io',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  pactFilesOrDirs: ['./pacts'],
  consumerVersion: process.env.GIT_COMMIT_SHA,
  tags: [process.env.GIT_BRANCH],
}).publishPacts();
```

### Can-I-Deploy Check

```bash
# Before deploying, verify all contracts
pact-broker can-i-deploy \
  --pacticipant WebApp \
  --version $GIT_COMMIT \
  --to-environment production
```

---

## CI/CD Integration

### Consumer Pipeline

```yaml
# .github/workflows/consumer.yml
name: Consumer Contract Tests
on: [push, pull_request]

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run contract tests
        run: npm run test:contracts
      
      - name: Publish contracts
        if: github.ref == 'refs/heads/main'
        env:
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
        run: npm run pact:publish
```

### Provider Pipeline

```yaml
# .github/workflows/provider.yml
name: Provider Contract Verification
on:
  push:
  # Webhook from Pact Broker when new contracts published
  repository_dispatch:
    types: [contract_requiring_verification_published]

jobs:
  verify-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start test server
        run: npm run start:test &
        
      - name: Verify contracts
        env:
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
        run: npm run pact:verify
      
      - name: Can-I-Deploy check
        run: |
          pact-broker can-i-deploy \
            --pacticipant UserService \
            --version ${{ github.sha }} \
            --to-environment production
```

---

## Best Practices

### Contract Design

```typescript
// ✅ Good: Loose contracts with matchers
body: {
  id: integer(),
  name: string(),
  email: regex('test@example.com', '^[\\w.-]+@[\\w.-]+\\.\\w+$'),
}

// ❌ Bad: Exact value matching (brittle)
body: {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com',
}
```

### State Naming

```typescript
// ✅ Good: Descriptive, scenario-based
'user 123 exists with admin role'
'shopping cart has 3 items'
'payment method is expired'

// ❌ Bad: Implementation-focused
'insert row in users table'
'mock payment to return error'
```

### Testing Boundaries

| Test Type | What It Validates |
|-----------|-------------------|
| Contract Test | API shape, status codes, data types |
| Unit Test | Business logic, edge cases |
| Integration Test | Full flow with real services |

---

## Handling Breaking Changes

### Safe Changes (Non-Breaking)

- Adding new optional fields
- Adding new endpoints
- Relaxing validation rules

### Unsafe Changes (Breaking)

- Removing fields
- Changing field types
- Changing required/optional status
- Renaming fields

### Migration Strategy

```typescript
// 1. Add new field (backward compatible)
response: {
  userName: string(),      // Old field
  displayName: string(),   // New field
}

// 2. Update all consumers to use new field

// 3. Deprecate old field (after all consumers migrated)
response: {
  displayName: string(),
}
```

---

## Error Contract Testing

```typescript
// Test error responses
it('returns 404 when user not found', async () => {
  await provider
    .given('user 999 does not exist')
    .uponReceiving('a request for non-existent user')
    .withRequest({
      method: 'GET',
      path: '/api/users/999',
    })
    .willRespondWith({
      status: 404,
      body: {
        error: string('Not Found'),
        message: string('User not found'),
      },
    });

  await provider.executeTest(async (mockServer) => {
    const client = new UserApiClient(mockServer.url);
    await expect(client.getUser(999)).rejects.toThrow('User not found');
  });
});
```

---

## Related Knowledge

- [Test Levels](test-levels.md) - Where contract tests fit
- [Network First](network-first.md) - API mocking patterns
- [CI Burn-In](ci-burn-in.md) - CI pipeline strategies

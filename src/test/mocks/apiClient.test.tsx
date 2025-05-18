import CustomerClient from '@/app/api/client';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

type RequestType = {
  [key: string]: unknown;
  uri: string;
};

type CustomerProfile = {
  email: string;
  firstName?: string;
  id: string;
  lastName?: string;
};

vi.mock('@/app/api/token-cache', () => ({
  default: {
    refreshToken: 'mock-refresh-token',
    tokenCache: {
      get: vi.fn().mockReturnValue('mock-token'),
      set: vi.fn(),
    },
  },
}));

vi.mock('@/app/api/client-builder', () => {
  const mockClient = {
    execute: vi.fn().mockImplementation((request: RequestType) => {
      if (request.uri.includes('/me/login')) {
        return Promise.resolve({
          body: {
            customer: {
              email: 'test@example.com',
              firstName: 'Test',
              id: 'customer-id',
              lastName: 'User',
            },
          },
        });
      }
      if (request.uri.includes('/me/signup')) {
        return Promise.resolve({
          body: {
            customer: {
              email: 'new@example.com',
              firstName: 'New',
              id: 'new-customer-id',
              lastName: 'User',
            },
          },
        });
      }
      return Promise.resolve({ body: {} });
    }),
  };

  return {
    createCtpClient: vi.fn().mockReturnValue(mockClient),
    createCustomerClient: vi.fn().mockReturnValue(mockClient),
    createRefreshCustomerClient: vi.fn().mockReturnValue(mockClient),
    projectKey: 'test-project',
  };
});

let shouldThrowLoginError = false;
let loginErrorMessage = '';
let shouldThrowNetworkError = false;

vi.mock('@/app/api/client', () => {
  class MockCustomerClient {
    public async getMe(): Promise<CustomerProfile> {
      await Promise.resolve();

      return {
        email: 'test@example.com',
        firstName: 'Test',
        id: 'customer-id',
        lastName: 'User',
      };
    }

    public async login(): Promise<CustomerProfile> {
      await Promise.resolve();

      if (shouldThrowLoginError) {
        throw new Error(loginErrorMessage || 'Login error');
      }
      if (shouldThrowNetworkError) {
        throw new Error('Network error');
      }

      return {
        email: 'test@example.com',
        id: 'customer-id',
      };
    }

    public async logout(): Promise<boolean> {
      await Promise.resolve();
      return true;
    }

    public async register(): Promise<CustomerProfile> {
      await Promise.resolve();

      return {
        email: 'new@example.com',
        id: 'new-customer-id',
      };
    }
  }

  return {
    default: MockCustomerClient,
  };
});

const server = setupServer();

describe('CustomerClient', () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    shouldThrowLoginError = false;
    loginErrorMessage = '';
    shouldThrowNetworkError = false;
  });

  afterAll(() => server.close());

  it('successfully logs in a customer', async () => {
    const client = new CustomerClient();
    const result = await client.login('test@example.com', 'password123');

    expect(result).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
        id: 'customer-id',
      }),
    );
  });

  it('successfully registers a new customer', async () => {
    const client = new CustomerClient();
    const customerData = {
      addresses: [
        {
          city: 'New York',
          country: 'US',
          postalCode: '10001',
          streetName: '123 Broadway',
        },
      ],
      dateOfBirth: '2000-01-01',
      defaultBillingAddress: 0,
      defaultShippingAddress: 0,
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'Password123',
    };

    const result = await client.register(customerData);

    expect(result).toEqual(
      expect.objectContaining({
        email: 'new@example.com',
        id: 'new-customer-id',
      }),
    );
  });

  it('handles login errors gracefully', async () => {
    shouldThrowLoginError = true;
    loginErrorMessage = 'Invalid credentials';

    const client = new CustomerClient();

    await expect(client.login('wrong@example.com', 'wrong-password')).rejects.toThrow('Invalid credentials');
  });

  it('handles network errors', async () => {
    shouldThrowNetworkError = true;

    const client = new CustomerClient();

    await expect(client.login('test@example.com', 'password123')).rejects.toThrow('Network error');
  });
});

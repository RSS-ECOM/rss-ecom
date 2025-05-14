/* eslint-disable import/no-extraneous-dependencies */
import LayoutContent from '@/components/layout/LayoutContent/LayoutContent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/api/client-builder', () => ({
  createCtpClient: vi.fn(() => ({})),
  createCustomerClient: vi.fn(() => ({})),
  createRefreshCustomerClient: vi.fn(() => ({})),
  projectKey: 'test-project',
  scopes: ['scope1', 'scope2'],
}));

vi.mock('@/app/api/token-cache', () => ({
  default: {
    cachedToken: {
      expirationTime: 0,
      token: '',
    },
    refreshToken: undefined,
    tokenCache: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  // sorting
  usePathname: (): string => '/',
  useRouter: (): Record<string, () => void> => ({
    prefetch: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// next-themes
vi.mock('next-themes', () => ({
  useTheme: (): Record<string, unknown> => ({
    setTheme: vi.fn(),
    theme: 'light',
  }),
}));

// zustand auth-store
vi.mock('@/store/auth-store', () => ({
  __esModule: true,
  default: (): Record<string, unknown> => ({
    isLoggedIn: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  getState: (): Record<string, boolean> => ({
    isLoggedIn: false,
  }),
}));

// use-customer
vi.mock('@/hooks/use-customer', () => ({
  useCustomer: (): Record<string, unknown> => ({
    isLoginLoading: false,
    isRegisterLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  }),
}));

vi.mock('@/lib/customer-client', () => ({
  useCustomerClient: (): Record<string, unknown> => ({
    customerClient: {},
  }),
}));

const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('LayoutContent', () => {
  it('renders the layout content with children', () => {
    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <LayoutContent>
          <div data-testid="test-content">Test Content</div>
        </LayoutContent>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('test-content')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});

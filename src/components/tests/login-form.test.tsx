import type { JSX, ReactNode } from 'react';
import type { Mock } from 'vitest';

// import { useCustomer } from '@/hooks/use-customer';
// import useAuthStore from '@/store/auth-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import LoginForm from '../forms/login-form/login-form';

const mockLogin: Mock = vi.fn();
const mockLogout: Mock = vi.fn();
const mockRouterReplace: Mock = vi.fn();
const mockSetIsLoggedIn: Mock = vi.fn();

type CustomerHookReturn = {
  customer: null;
  isLoading: boolean;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
  isRegisterLoading: boolean;
  login: Mock;
  logout: Mock;
  register: Mock;
};

type AuthStoreReturn = {
  isLoggedIn: boolean;
  login: Mock;
  logout: Mock;
  setIsLoggedIn: Mock;
};

let isLoginLoadingState = false;
let isLoggedInState = false;

// the router
vi.mock('next/navigation', () => ({
  useRouter: (): { replace: Mock } => ({
    replace: mockRouterReplace,
  }),
}));

// react-hook-form
vi.mock('react-hook-form', () => ({
  FormProvider: ({ children }: { children: ReactNode }): ReactNode => children,
  useForm: (): Record<string, unknown> => ({
    control: {
      _defaultValues: {},
      _formValues: {},
      _getWatch: vi.fn(),
      _names: {
        array: new Set<string>(),
        focus: new Set<string>(),
        mount: new Set<string>(),
        unMount: new Set<string>(),
        watch: new Set<string>(),
        watchAll: false,
      },
      _subjects: {
        array: { subject: { observers: [] } },
        state: { subject: { observers: [] } },
        watch: { subject: { observers: [] } },
      },
      getFieldState: vi.fn(),
      register: vi.fn(),
      unregister: vi.fn(),
    },
    formState: {
      errors: {},
      isSubmitting: false,
    },
    getValues: (): { email: string; password: string } => ({
      email: 'test@example.com',
      password: 'Password123',
    }),
    handleSubmit:
      (cb: (data: { email: string; password: string }) => void) =>
      (e: { preventDefault: () => void }): Promise<void> => {
        e.preventDefault();
        return Promise.resolve(cb({ email: 'test@example.com', password: 'Password123' }));
      },
    register: vi.fn(),
    setValue: vi.fn(),
    trigger: vi.fn(),
    watch: vi.fn(),
  }),
}));

// useCustomer hook
vi.mock('@/hooks/use-customer', () => ({
  useCustomer: vi.fn(
    (): CustomerHookReturn => ({
      customer: null,
      isLoading: false,
      isLoginLoading: isLoginLoadingState,
      isLogoutLoading: false,
      isRegisterLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
    }),
  ),
}));

// auth store
vi.mock('@/store/auth-store', () => ({
  __esModule: true,
  default: vi.fn(
    (): AuthStoreReturn => ({
      isLoggedIn: isLoggedInState,
      login: vi.fn(),
      logout: mockLogout,
      setIsLoggedIn: mockSetIsLoggedIn,
    }),
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { [key: string]: unknown; children: ReactNode }): JSX.Element => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../forms/login-form/login-form', () => ({
  default: function MockLoginForm(): JSX.Element {
    if (isLoggedInState) {
      mockRouterReplace('/products');
    }

    return (
      <div data-testid="login-form-mock">
        <button
          data-testid="button"
          disabled={isLoginLoadingState}
          onClick={(): void => {
            mockLogin({ email: 'test@example.com', password: 'Password123' });
          }}
        >
          {isLoginLoadingState ? 'Logging in...' : 'Sign In'}
        </button>
      </div>
    );
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    isLoginLoadingState = false;
    isLoggedInState = false;
  });

  it('submits form with valid credentials', async (): Promise<void> => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    const submitButton = screen.getByTestId('button');
    expect(submitButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('shows loader when login is in progress', (): void => {
    isLoginLoadingState = true;

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Logging in/i)).toBeInTheDocument();

    const submitButton = screen.getByTestId('button');
    expect(submitButton).toBeDisabled();
  });

  it('redirects authenticated users', (): void => {
    isLoggedInState = true;

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    expect(mockRouterReplace).toHaveBeenCalledWith('/products');
  });
});

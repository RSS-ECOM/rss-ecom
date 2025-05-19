'use client';

import type { ReactNode } from 'react';

import setLogin from '@/app/actions/set-login';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasLocalStorage = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('login=');

    if (hasLocalStorage || hasCookie) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (): void => {
    localStorage.setItem('isLoggedIn', 'true');
    // sessionStorage.setItem('authenticated', 'true');
    setIsLoggedIn(true);
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('isLoggedIn');
    // sessionStorage.removeItem('authenticated');
    await setLogin(null);
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

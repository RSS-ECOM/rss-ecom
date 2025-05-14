import useAuthStore from '@/store/auth-store';
import { useEffect } from 'react';

export function useAuthSync() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('login=');

    if (hasCookie && !isLoggedIn) {
      login();
    }
  }, [isLoggedIn, login]);
}

/* eslint-disable import/no-extraneous-dependencies */
import setLogin from '@/app/actions/set-login';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: (): void => set({ isLoggedIn: true }),
      logout: async (): Promise<void> => {
        await setLogin(null);
        set({ isLoggedIn: false });

        try {
          window.localStorage.setItem('auth-storage', JSON.stringify({ state: { isLoggedIn: false }, version: 0 }));
        } catch (e) {
          console.error('Error in localStorage:', e);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;

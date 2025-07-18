import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BACKEND_URL } from '../config/config';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthStoreType = {
  user: null | User;
  isLoading: boolean;
  setUser: (u: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set(() => ({ user })),
      clearUser: () => set(() => ({ user: null })),
      setLoading: (isLoading) => set(() => ({ isLoading })),
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${BACKEND_URL}/app-user/me`, {
            credentials: 'include'
          });

          if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
          } else {
            set({ user: null });
          }
        } catch (error) {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

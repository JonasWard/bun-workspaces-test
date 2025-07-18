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
  sessionId: string | null;
  isLoading: boolean;
  setUser: (u: User) => void;
  setSessionId: (sessionId: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      user: null,
      sessionId: null,
      isLoading: false,
      setUser: (user) => set(() => ({ user })),
      setSessionId: (sessionId) => set(() => ({ sessionId })),
      clearUser: () => set(() => ({ user: null, sessionId: null })),
      setLoading: (isLoading) => set(() => ({ isLoading })),
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          console.log('=== CHECK AUTH DEBUG ===');
          console.log('Document cookies before request:', document.cookie);
          console.log('Making request to:', `${BACKEND_URL}/app-user/me`);

          const { sessionId } = get();
          console.log('Stored sessionId:', sessionId);

          // Prepare headers with Authorization fallback
          const headers: HeadersInit = {};
          if (sessionId) {
            headers['Authorization'] = `Bearer ${sessionId}`;
            console.log('Adding Authorization header with sessionId');
          }

          const response = await fetch(`${BACKEND_URL}/app-user/me`, {
            credentials: 'include',
            headers
          });

          console.log('Auth check response status:', response.status);
          console.log('Auth check response headers:', Object.fromEntries(response.headers.entries()));
          console.log('=== END CHECK AUTH DEBUG ===');

          if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
          } else {
            set({ user: null, sessionId: null });
          }
        } catch (error) {
          console.log('Auth check error:', error);
          set({ user: null, sessionId: null });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, sessionId: state.sessionId })
    }
  )
);

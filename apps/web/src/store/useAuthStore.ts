import { create } from 'zustand';

type AuthStoreType = {
  user: null | { username: string; email: string };
  setUser: (u: { username: string; email: string }) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null }))
}));

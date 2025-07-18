import { useAuthStore } from '@/store/useAuthStore';

export const handleLogin = async (username: string, password: string) => {
  const res = await fetch('http://localhost:5000/app-user/login', {
    method: 'POST',
    credentials: 'include', // 🔐 KEY: include cookies
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  useAuthStore.getState().setUser(data);
};

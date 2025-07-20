import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { BACKEND_URL } from '../../config/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/app-user/me`, {
          credentials: 'include',
          method: 'GET'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          clearUser();
          window.location.hash = '/login';
        }
      } catch (error) {
        clearUser();
        window.location.hash = '/login';
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [user, setUser, clearUser]);

  if (loading) return <div>Checking authentication...</div>;
  if (!user) return <span>you are not logged in! nothing to see here for you!</span>;

  return <>{children}</>;
};

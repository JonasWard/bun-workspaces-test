import { BACKEND_URL } from '../../config/config';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface BackendHealthCheckProps {
  children: React.ReactNode;
}

export const BackendHealthCheck: React.FC<BackendHealthCheckProps> = ({ children }) => {
  const [isBackendAlive, setIsBackendAlive] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${BACKEND_URL}/is-alive`, {
        method: 'GET',
        credentials: 'include'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.success === true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const performHealthCheck = async () => {
      setIsChecking(true);
      const isAlive = await checkBackendHealth();

      if (isAlive) {
        setIsBackendAlive(true);
        setIsChecking(false);
        if (intervalId) {
          clearInterval(intervalId);
        }
      } else {
        setRetryCount((prev) => prev + 1);
      }
    };

    // Initial check
    performHealthCheck();

    // Set up retry interval if backend is not alive
    if (!isBackendAlive) {
      intervalId = setInterval(performHealthCheck, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isBackendAlive]);

  if (isBackendAlive) {
    return <>{children}</>;
  }

  return (
    <Modal open closeIcon={null} footer={null}>
      <div className="mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Connecting to Backend</h2>
      <p className="text-gray-600 mb-2">{isChecking ? 'Checking backend status...' : 'Backend is not responding'}</p>
      {retryCount > 0 && <p className="text-sm text-gray-500">Retry attempt: {retryCount}</p>}
    </Modal>
  );
};

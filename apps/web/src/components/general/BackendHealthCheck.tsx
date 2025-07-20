import { BACKEND_URL } from '../../config/config';
import { useModelStore } from '../../store/useModelStore';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface BackendHealthCheckProps {
  children: React.ReactNode;
}

export const BackendHealthCheck: React.FC<BackendHealthCheckProps> = ({ children }) => {
  const [isBackendAlive, setIsBackendAlive] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loaded = useModelStore((s) => s.loaded);
  const loadedCollections = useModelStore((s) => s.loadedCollections);

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
      const isAlive = await checkBackendHealth();

      if (isAlive) {
        setIsBackendAlive(true);
        if (intervalId) clearInterval(intervalId);

        // Load all data once backend is alive
        useModelStore.getState().getAllData();
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

  // Show children only when backend is alive AND data is loaded
  if (isBackendAlive && loaded) {
    return <>{children}</>;
  }

  // Show loading modal with integrated Loading component logic
  return (
    <Modal open closeIcon={null} footer={null}>
      <div className="flex flex-col gap-3 items-center text-base">
        {!isBackendAlive ? (
          <>
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
            <span className="text-xl font-semibold">Connecting to Backend</span>
            <span className="text-gray-600">Backend is not responding</span>
            <span className="text-sm text-gray-500">Retry attempt: {retryCount}</span>
          </>
        ) : (
          <>
            <span>loaded {loadedCollections.length} collections</span>
            <span>Loading application data...</span>
          </>
        )}
      </div>
    </Modal>
  );
};

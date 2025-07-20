import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BACKEND_URL } from '@/config/config';
import { GenericRenderer } from './GenericRenderer';

export const WithBackendCall: React.FC = () => {
  const { collection, id } = useParams<{ collection: string; id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BACKEND_URL}/${collection}/${id}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (collection && id) fetchData();
  }, [collection, id]);

  if (loading) {
    return <div>Loading specific data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="no-data">
        <p>
          No data found for {collection}/{id}
        </p>
      </div>
    );
  }

  return <GenericRenderer o={data} />;
};

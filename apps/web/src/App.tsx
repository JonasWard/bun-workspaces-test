import React, { useEffect } from 'react';
import './index.css';
import { helperMethod } from 'core';
import { GenericRenderer } from './components/GenericRenderer';
import { useModelStore } from './store/useModelStore';

export const App: React.FC = () => {
  const data = useModelStore(s => s.data);

  useEffect(() => {
    useModelStore.getState().getAllData()
  }, []);

  return (
    <div>
      <div>
        <span className="flex flex-row gap-2 p-2 text-black">{helperMethod('helper!')}</span>
        <div className="max-h-[85svh] overflow-y-scroll">else</div>
        {data?.components ? <GenericRenderer o={data?.components ?? {missing: 'data'}} /> : null}
      </div>
    </div>
  );
};

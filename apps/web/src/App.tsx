import React, { useEffect, useState } from 'react';
import './index.css';
import { ComponentType, DatabaseType, helperMethod } from 'core';
import { ExampleDataType, getGetMethodFrontendForEachReferencableType } from 'orm';
import { GenericRenderer } from './components/GenericRenderer';

export const App: React.FC = () => {
  const [component, setComponent] = useState<ComponentType | null>(null);

  const getSomeRandomData = async () => {
    const apicalls = getGetMethodFrontendForEachReferencableType<DatabaseType>(
      ExampleDataType,
      'http://localhost:5000'
    );
    try {
      const component = await apicalls.components('0');
      if (component) setComponent(component);
    } catch {}
  };

  useEffect(() => {
    getSomeRandomData();
  }, []);

  return (
    <div>
      <div>
        <span className="flex flex-row gap-2 p-2 text-black">{helperMethod('helper!')}</span>
        <div className="max-h-[85svh] overflow-y-scroll">else</div>
        {component ? <GenericRenderer o={component} /> : null}
      </div>
    </div>
  );
};

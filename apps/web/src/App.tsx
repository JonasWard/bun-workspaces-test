import React from 'react';
import './index.css';
import { DatabaseType, helperMethod } from 'core';
import { useModelStore } from './store/useModelStore';
import { ExampleDataType, getRenderAndUpdateGraphForReferencableDataType } from 'orm';
import { FlatTreeRenderer } from './components/data/content/FlatTreeRenderer';
import { Page } from './components/general/Page';

const objectsToRender = getRenderAndUpdateGraphForReferencableDataType<DatabaseType>(ExampleDataType);

export const App: React.FC = () => {
  const data = useModelStore((s) => s.data);

  return (
    <Page>
      <div>
        <div>
          <span className="flex flex-row gap-2 p-2 text-black">{helperMethod('helper!')}</span>
          <div className="max-h-[85svh] overflow-y-scroll">else</div>
          {data?.components && data?.components[0] ? (
            <FlatTreeRenderer o={data.components[0]} dataDefinition={objectsToRender['ComponentType']} />
          ) : null}
        </div>
      </div>
    </Page>
  );
};

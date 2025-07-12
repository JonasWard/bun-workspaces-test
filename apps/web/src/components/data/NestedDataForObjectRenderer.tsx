import { useParams } from 'react-router';
import { useModelStore } from '@/store/useModelStore';
import { useEffect } from 'react';
import { DatabaseType } from 'core';
import { MissingObject } from './content/MissingObject';
import { CollapsableRenderer } from './content/CollapsableRenderer';
import { Loading } from './content/Loading';

export const NestedDataForObjectRenderer: React.FC = () => {
  const { collectionName, id } = useParams();
  const data = useModelStore((s) => s.data);
  const loaded = useModelStore((s) => s.loaded);

  useEffect(() => {
    if (Object.keys(data).length === 0) useModelStore.getState().getAllData();
  }, [data]);

  return loaded ? (
    collectionName && id ? (
      <div className="grid grid-cols-[100px_auto] gap-2 p-2 bg-zinc-200">
        <CollapsableRenderer collectionName={collectionName as keyof DatabaseType} id={id} />
      </div>
    ) : (
      <MissingObject collectionName={collectionName} id={id} renderStyle="full-page" />
    )
  ) : (
    <Loading />
  );
};

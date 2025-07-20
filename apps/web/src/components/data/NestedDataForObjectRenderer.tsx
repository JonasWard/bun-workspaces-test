import { useParams } from 'react-router';
import { DatabaseType } from 'core';
import { MissingObject } from './content/MissingObject';
import { CollapsableRenderer } from './content/CollapsableRenderer';
import { Page } from '../general/Page';

export const NestedDataForObjectRenderer: React.FC = () => {
  const { collectionName, id } = useParams();

  return (
    <Page>
      {collectionName && id ? (
        <div className="grid grid-cols-[100px_auto] gap-2 p-2 bg-zinc-200">
          <CollapsableRenderer collectionName={collectionName as keyof DatabaseType} id={id} />
        </div>
      ) : (
        <MissingObject collectionName={collectionName} id={id} renderStyle="full-page" />
      )}
    </Page>
  );
};

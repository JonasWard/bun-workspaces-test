import { useModelStore } from '@/store/useModelStore';
import { DatabaseType } from 'core';
import { getUniqueNameForNestedReferences, NestedReferences } from 'orm';
import { getName, getValueForNestedReference } from './logic';

const EntryRenderer: React.FC<{
  nestedReference: NestedReferences<DatabaseType>;
  objectType: string;
  object: any | undefined;
  data: DatabaseType;
}> = ({ nestedReference, objectType, object, data }) => (
  <>
    <span>{getName(objectType, getUniqueNameForNestedReferences(nestedReference))}</span>
    <span>{getValueForNestedReference(nestedReference, object, data)}</span>
  </>
);

export const FlatTreeRender: React.FC<{
  dataDefinition: NestedReferences<DatabaseType>[];
  o: DatabaseType[keyof DatabaseType][0];
}> = ({ dataDefinition, o }) => {
  const data = useModelStore((s) => s.data);

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-2">
      {dataDefinition?.map((d, index) => (
        <EntryRenderer key={index} objectType={o.type} nestedReference={d} object={o} data={data} />
      ))}
    </div>
  );
};

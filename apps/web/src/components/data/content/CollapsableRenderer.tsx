import { useModelStore } from '@/store/useModelStore';
import { DatabaseType, UnionType } from 'core';
import { ExampleDataType, getMappingObjectForDataDefinition, ReservedStrings, ReservedStringsArray } from 'orm';
import { useMemo } from 'react';
import { MissingObject } from './MissingObject';

const dataMap = getMappingObjectForDataDefinition<DatabaseType>(ExampleDataType.types);

console.log(dataMap);

type FlatContent = string | number | boolean | object;
type ContentType = FlatContent | FlatContent[];

const EntryRenderer: React.FC<{ fieldName: string; content: ContentType; oType: string }> = ({
  fieldName,
  content,
  oType
}) => {
  if (ReservedStringsArray.includes(fieldName as ReservedStrings)) return null;
  else if (typeof content === 'object')
    return (
      <>
        <span key={fieldName}>{fieldName}</span>
        <details key={fieldName + '-detail'}>
          <summary>{fieldName}</summary>
          <div className="flex flex-column">
            {Array.isArray(content) ? (
              content.map((c, i) => (
                <EntryRenderer fieldName={`${fieldName} ${i.toString()}`} content={c} oType={oType} />
              ))
            ) : (
              <GenericRenderer o={content as UnionType} />
            )}
          </div>
        </details>
      </>
    );
  else if (dataMap[oType] && dataMap[oType][fieldName])
    return <CollapsableRenderer collectionName={dataMap[oType][fieldName]} id={content as string} />;
  else
    return (
      <>
        <span key={fieldName}>{fieldName}</span>
        <span key={fieldName + '-content'}>{content}</span>
      </>
    );
};

export const GenericRenderer: React.FC<{ o: UnionType }> = ({ o }) => (
  <div className="grid grid-cols-[120px_auto] gap-2 p-2 bg-zinc-200">
    {Object.entries(o).map(([fieldLabel, content]) => {
      if (ReservedStringsArray.includes(fieldLabel as ReservedStrings)) return null;
      else if (dataMap[o.type] && dataMap[o.type][fieldLabel])
        return <CollapsableRenderer collectionName={dataMap[o.type][fieldLabel]} id={content} />;
      return <EntryRenderer fieldName={fieldLabel} content={content} oType={o.type} />;
    })}
  </div>
);

export const CollapsableRenderer: React.FC<{
  collectionName: keyof DatabaseType;
  id: string;
}> = ({ collectionName, id }) => {
  const data = useModelStore((s) => s.data);

  const o = useMemo(
    () =>
      (data[collectionName as keyof DatabaseType] &&
        data[collectionName as keyof DatabaseType].find((o) => o._id === id)) ??
      undefined,
    [collectionName, id, data]
  );

  return (
    <>
      <span key={collectionName}>{collectionName}</span>
      {o ? (
        <details className="grid grid-cols-[120px_auto] gap-2 bg-zinc-200">
          <summary key={id}>{id}</summary>
          <GenericRenderer o={o} />
        </details>
      ) : (
        <MissingObject collectionName={collectionName} id={id} />
      )}
    </>
  );
};

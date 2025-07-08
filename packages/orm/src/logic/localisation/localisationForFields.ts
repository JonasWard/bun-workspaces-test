import { DataTypeV3 } from '../../types';
import { getRenderAndUpdateGraphForReferencableDataType, getUniqueNameForNestedReferences } from '../graph';

const parseDatabaseTypeLocal = (
  nestedPathRecordNames: Record<string, Record<string, string>>,
  data: DataTypeV3
): Record<string, Record<string, string>> => {
  const databaseFieldContentEntries = Object.entries(nestedPathRecordNames);
  const existingDatabaseFieldContentEntries = Object.entries(data.databaseTypeLocal);

  const fieldSet = new Set([
    ...databaseFieldContentEntries.map(([fieldName]) => fieldName),
    ...existingDatabaseFieldContentEntries.map(([fieldName]) => fieldName)
  ]);
  return Object.fromEntries(
    [...fieldSet.values()].map((k) => {
      const databaseFieldContent = nestedPathRecordNames[k];
      const existingDatabaseFieldContent = data.databaseTypeLocal[k];

      if (databaseFieldContent && existingDatabaseFieldContent)
        return [k, { ...databaseFieldContent, ...existingDatabaseFieldContent }];
      else return [k, databaseFieldContent ? databaseFieldContent : existingDatabaseFieldContent];
    })
  );
};

export const getLocalisationMapForFields = (data: DataTypeV3) => {
  const nestedPathRecordString = Object.fromEntries(
    Object.entries(getRenderAndUpdateGraphForReferencableDataType(data)).map(([l, c]) => [
      l,
      Object.fromEntries(
        c.map((l) => {
          const label = getUniqueNameForNestedReferences(l);
          return [label, label];
        })
      )
    ])
  );

  return {
    ...data,
    databaseTypeLocal: parseDatabaseTypeLocal(nestedPathRecordString, data)
  };
};

import {
  DataType,
  DBType,
  FlatRecord,
  FlatReferences,
  NestedReferences,
  RenderType,
  TypeDefinition
} from '../../types';
import { isEnum, isSpecialType } from '../nesting';
import { getDatabaseFieltNames, getFieldNameFromType } from '../parsing';
import { getFieldLabelName, getFieldType, isFieldReference } from '../typeDefinition';

const createNestedLabelList = <T extends DBType>(
  currentData: FlatReferences[],
  flatRecord: FlatRecord,
  typesIncluded: string[]
): NestedReferences<T>[] => {
  const nestedReferences: NestedReferences<T>[] = [];

  currentData.forEach((nR) => {
    switch (nR.length) {
      case 2:
        nestedReferences.push(nR);
        break;
      case 3:
        if (nR[2] === 'enum') nestedReferences.push(nR);
        else
          createNestedLabelList(flatRecord[nR[1]], flatRecord, [...typesIncluded, nR[1]]).forEach((nRResult) =>
            nestedReferences.push([nR[0], nRResult, nR[2]])
          );
        break;
      case 4:
        if (typesIncluded.includes(nR[2])) nestedReferences.push([nR[0], nR[1], nR[2], 'button']);
        else
          createNestedLabelList(flatRecord[nR[2]], flatRecord, [...typesIncluded, nR[2]]).forEach((nRResult) =>
            nestedReferences.push([nR[0], nR[1], nRResult, nR[3]])
          );
        break;
    }
  });
  return nestedReferences;
};

const delimeter = '_';

const concatString = (s: string, startString?: string) => (startString ? `${startString}${delimeter}${s}` : s);

const getRecursiveLabelName = <T extends DBType>(data: NestedReferences<T>, startString?: string): string => {
  if (!Array.isArray(data)) return concatString(data, startString);
  switch (data.length) {
    case 2:
      return concatString(data[0], startString);
    case 3:
      return Array.isArray(data[1])
        ? concatString(getRecursiveLabelName(data[1]), concatString(data[0], startString))
        : concatString(data[0], startString);
    case 4:
      return Array.isArray(data[2])
        ? concatString(getRecursiveLabelName(data[2]), concatString(data[0], startString))
        : concatString(data[0], startString);
  }
};

export const getShortLabelName = (label: string) => {
  const lastIndex = label.lastIndexOf(delimeter);
  return lastIndex === -1 ? label : label.slice(lastIndex + 1);
};

export const getUniqueNameForNestedReferences = <T extends DBType>(data: NestedReferences<T>) =>
  getRecursiveLabelName(data);

export const getRenderAndUpdateGraphForReferencableDataType = <T extends DBType>(
  dataType: DataType
): Record<string, NestedReferences<T>[]> => {
  const databaseTypes = dataType.types.filter((t) => t.canReference);
  const databaseTypeSet = new Set(databaseTypes.map((t) => t.label));
  const databaseTypeFieldNames = getDatabaseFieltNames(dataType);
  const databaseFieldTypeRecord = Object.fromEntries(databaseTypes.map((t, i) => [t.label, databaseTypeFieldNames[i]]));

  const flatRecord: FlatRecord = Object.fromEntries(
    dataType.types.map((t) => [
      t.label,
      t.fields.map(([label, type]) =>
        isSpecialType(type)
          ? databaseTypeSet.has(type)
            ? ([label, databaseFieldTypeRecord[type], type, undefined] as [
                string,
                string,
                string,
                RenderType | undefined
              ])
            : ([label, type, isEnum(type, dataType) ? 'enum' : undefined] as [string, string, RenderType | undefined])
          : ([label, type as RenderType] as [string, RenderType])
      )
    ])
  );
  return Object.fromEntries(
    databaseTypes.map((dbt) => [dbt.label, createNestedLabelList(flatRecord[dbt.label], flatRecord, [dbt.label])])
  ) as Record<string, NestedReferences<T>[]>;
};

export const getMappingObjectForDataDefinition = <T extends DBType>(
  typeDefinitions: TypeDefinition[]
): Record<string, Record<string, keyof T>> =>
  Object.fromEntries(
    typeDefinitions
      .map(
        (tD) =>
          [
            tD.label,
            tD.fields
              .filter((f) => isFieldReference(f))
              .map((tD) => [getFieldLabelName(tD), getFieldNameFromType(getFieldType(tD))] as [string, string])
          ] as [string, [string, string][]]
      )
      .filter(([_, tPairs]) => tPairs.length)
      .map(([label, tPairs]) => [label, Object.fromEntries(tPairs)])
  );

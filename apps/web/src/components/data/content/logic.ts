import { DatabaseType } from 'core';
import { ExampleDataType, getShortLabelName, NestedReferences } from 'orm';

export const getValueForNestedReference = (
  nestedReference: NestedReferences<DatabaseType>,
  object: any | undefined,
  data: DatabaseType
): string | boolean | number | null => {
  if (!object) return null;

  if (typeof nestedReference === 'string') return object[nestedReference[0]];

  switch (nestedReference.length) {
    case 2:
      return object[nestedReference[0]];
    case 3:
      return Array.isArray(nestedReference[1])
        ? getValueForNestedReference(nestedReference[1], object[nestedReference[0]], data)
        : object[nestedReference[0]];
    case 4:
      return getValueForNestedReference(
        nestedReference[2],
        data[nestedReference[1] as keyof DatabaseType].find((o) => o._id === object[nestedReference[0]]),
        data
      );
  }
};

export const getName = (databaseFieldName: string, label: string) =>
  ExampleDataType.databaseTypeLocal && ExampleDataType.databaseTypeLocal[databaseFieldName]
    ? ExampleDataType.databaseTypeLocal[databaseFieldName][label] ?? getShortLabelName(label)
    : getShortLabelName(label);

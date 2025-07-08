import { FieldBaseType, DataType, FieldDefinition, NestedLabelMap, NestedLabelType } from '../../types';
import { getDatabaseType } from '../parsing';
import { getFieldsWithReferencableForType } from '../defaultOptions';

export const PLACEHOLDER_TYPE_STRING = '_internalTypeName';

export const isSpecialType = (type: string) => !Object.values(FieldBaseType).includes(type as FieldBaseType);
export const isEnum = (type: string, data: DataType) => Boolean(data.enums.find(({ label }) => label === type));

const getFieldMapFromFields = (fields: FieldDefinition[], data: DataType) =>
  Object.fromEntries(fields.map(([fieldName, type]) => [fieldName, isEnum(type, data) ? 'enum' : type]));

const getMappedObject = (data: DataType): NestedLabelMap =>
  Object.fromEntries(
    data.types.map((o) => [o.label, getFieldMapFromFields(getFieldsWithReferencableForType(o), data)])
  );

const constructNestedLabelType = (typeMap: NestedLabelMap, type: string, previousTypes: string[]) =>
  Object.fromEntries([
    ...Object.entries(typeMap[type]).map(([fieldName, typeObject]) => [
      fieldName,
      getNestedLabelType(typeObject, typeMap, [...previousTypes, type])
    ]),
    [PLACEHOLDER_TYPE_STRING, type]
  ]);

const getNestedLabelType = (
  type: string,
  typeMap: NestedLabelMap,
  previousTypes: string[]
): string | { [fieldName: string]: string | NestedLabelType } =>
  typeMap[type] && !previousTypes.includes(type)
    ? constructNestedLabelType(typeMap, type, [...previousTypes, type])
    : previousTypes.includes(type)
    ? { [PLACEHOLDER_TYPE_STRING]: type }
    : type;

export const getLayeredTypes = (type: string, data: DataType): NestedLabelType => {
  const dataWithDatabaseType = { ...data, types: [...data.types, getDatabaseType(data)] };
  const typeMap = getMappedObject(dataWithDatabaseType);
  return constructNestedLabelType(typeMap, type, []);
};

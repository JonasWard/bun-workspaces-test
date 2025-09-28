// convex doesn't seem to support enums, so we will be storing these as string
// we don't make a distinction between float or int, so we will store all numbers as float64
// the convex schema only

const FILETOP = `import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';`;

const STRING_TYPE = 'v.string()';
const FLOAT64_TYPE = 'v.float64()';
const BOOLEAN_TYPE = 'v.boolean()';
const ANY_TYPE = 'v.any()';

import { DataType, FieldDefinition, TypeDefinition } from '../../../types';
import { getFieldsWithReferencableForType } from '../../defaultOptions';
import { getFieldLabelName, isFieldArray, isFieldOptional, isFieldReference, getFieldType } from '../../typeDefinition';
import { getFieldNameFromType } from './databaseType';

const getCamelCaseNameForType = (type: string) => type.charAt(0).toLowerCase() + type.slice(1);

const getField = (field: FieldDefinition) =>
  `${getFieldLabelName(field)}${isFieldOptional(field) ? '?' : ''}: ${
    isFieldReference(field) ? 'string' : getFieldType(field)
  }${isFieldArray(field) ? '[]' : ''}`;

const fieldContent = (field: FieldDefinition, typeLabelMap: Record<string, string>): string => {
  const fieldType = getFieldType(field);
  if (typeLabelMap[fieldType]) return typeLabelMap[fieldType];
  if (fieldType === 'string') return STRING_TYPE;
  if (fieldType === 'number') return FLOAT64_TYPE;
  if (fieldType === 'boolean') return BOOLEAN_TYPE;
  return ANY_TYPE;
};
const fieldArrayContent = (field: FieldDefinition, typeLabelMap: Record<string, string>): string =>
  isFieldArray(field) ? `v.array(${fieldContent(field, typeLabelMap)})` : fieldContent(field, typeLabelMap);
const fieldOptionalContent = (field: FieldDefinition, typeLabelMap: Record<string, string>): string =>
  isFieldOptional(field)
    ? `v.optional(${fieldArrayContent(field, typeLabelMap)})`
    : fieldArrayContent(field, typeLabelMap);

const getFieldContentString = (field: FieldDefinition, typeLabelMap: Record<string, string>): string =>
  `${getFieldLabelName(field)}: ${fieldOptionalContent(field, typeLabelMap)}`;

const getDocumentationString = (
  data: DataType
) => `// this file is created using a config file on jonasward.eu/doc-configer using the following config string:
// ${JSON.stringify(data)}`;

const typeFieldsContent = (typeDef: TypeDefinition, typeLabelMap: Record<string, string>, withType = false): string[] =>
  getFieldsWithReferencableForType(typeDef, withType).map((t) => getFieldContentString(t, typeLabelMap));

const typeObjectContent = (typeDef: TypeDefinition, typeLabelMap: Record<string, string>): string[] => [
  'v.object({',
  ...typeFieldsContent(typeDef, typeLabelMap).map((t) => `  ${t},`),
  '});'
];

const typeTableContent = (typeDef: TypeDefinition, typeLabelMap: Record<string, string>): string[] => [
  'defineTable({',
  ...typeFieldsContent(typeDef, typeLabelMap, true).map((t) => `  ${t},`),
  '}),'
];

const getTypeContentString = (typeDef: TypeDefinition, typeLabelMap: Record<string, string>) => {
  const [start, ...rest] = typeObjectContent(typeDef, typeLabelMap);
  return [`const ${typeLabelMap[typeDef.label]} = ${start}`, ...rest].join('\n');
};

const typeTableContentString = (typeDef: TypeDefinition, typeLabelMap: Record<string, string>): string[] => {
  const [start, ...rest] = typeTableContent(typeDef, typeLabelMap);
  return [`${getFieldNameFromType(typeDef.label)}: ${start}`, ...rest];
};

const getTypeSchemaContentString = (
  referencableTypes: TypeDefinition[],
  typeLabelMap: Record<string, string>
) => `export default defineSchema({
${referencableTypes
  .map((t) =>
    typeTableContentString(t, typeLabelMap)
      .map((t) => `  ${t}`)
      .join('\n')
  )
  .join('\n')}
});`;

const getTypeLabelMap = (
  nonReferencableTypes: TypeDefinition[],
  referencableTypeNames: Set<string>,
  enumNames: Set<string>
): Record<string, string> =>
  Object.fromEntries([
    ...nonReferencableTypes.map((t) => [t.label, getCamelCaseNameForType(t.label)]),
    ...nonReferencableTypes.map((t) => [`'${t.label}'`, STRING_TYPE]),
    ...referencableTypeNames.values().map((e) => [e, STRING_TYPE]),
    ...referencableTypeNames.values().map((e) => [`'${e}'`, STRING_TYPE]),
    ...enumNames.values().map((e) => [e, STRING_TYPE]),
    ...referencableTypeNames.values().map((e) => [`'${e}'`, STRING_TYPE])
  ]);

/**
 * Method that creates a typesheet for the objects defined in your model
 * @param data - `DataType`
 * @param withDatabaseType - optional, if set to `false`, will not add `DataBaseType` to typesheet
 * @returns type sheet content
 */
export const getConvexSchemaForData = (data: DataType): string => {
  // filter out all the types that are not referencable -> those will not get a table
  const referencableTypes: TypeDefinition[] = [];
  const nonReferencableTypes: TypeDefinition[] = [];

  for (const typeDef of data.types) {
    if (typeDef.canReference) referencableTypes.push(typeDef);
    else nonReferencableTypes.push(typeDef);
  }

  const referencableTypeNames = new Set(referencableTypes.map((t) => t.label));
  const enumNames = new Set(data.enums.map((e) => e.label));

  // first create all the non referencable types
  const typeLabelMap = getTypeLabelMap(nonReferencableTypes, referencableTypeNames, enumNames);

  return `${getDocumentationString(data)}
${FILETOP}

${nonReferencableTypes.map((t) => getTypeContentString(t, typeLabelMap)).join('\n\n')}

${getTypeSchemaContentString(referencableTypes, typeLabelMap)}`;
};

// this filed parse a `DataType` definition into a typescript typesheet

import { DataType, EnumDefinition, FieldDefinition, TypeDefinition } from '../../types';
import { getDatabaseType } from './databaseType';
import { getFieldsWithReferencableForType } from '../defaultOptions';
import { getFieldLabelName, isFieldArray, isFieldOptional, isFieldReference, getFieldType } from '../typeDefinition';

const getEnum = (enumDef: EnumDefinition) => `export enum ${enumDef.label} {
  ${enumDef.stringValues.map((s) => `${s} = '${s}'`).join(',\n  ')}
};`;

const getField = (field: FieldDefinition) =>
  `${getFieldLabelName(field)}${isFieldOptional(field) ? '?' : ''}: ${
    isFieldReference(field) ? 'string' : getFieldType(field)
  }${isFieldArray(field) ? '[]' : ''}`;

const getType = (typeDef: TypeDefinition) => `export type ${typeDef.label} = {
  ${getFieldsWithReferencableForType(typeDef).map(getField).join(';\n  ')};
};`;

const getFieldTypeString = (field: FieldDefinition) =>
  `${getFieldLabelName(field)}${isFieldOptional(field) ? '?' : ''}: "${getFieldType(field)}${
    isFieldArray(field) ? '[]' : ''
  }"`;

const getTypeMap = (typeDef: TypeDefinition) => `export const ${typeDef.label} = {
  ${getFieldsWithReferencableForType(typeDef).map(getFieldTypeString).join(',\n  ')};
};`;

/**
 * Method that creates a typesheet for the objects defined in your model
 * @param data - `DataType`
 * @param withDatabaseType - optional, if set to `false`, will not add `DataBaseType` to typesheet
 * @returns type sheet content
 */
export const getTypeMapForData = (
  data: DataType,
  withDatabaseType: boolean = true
): string => `// this file is created using a config file on jonasward.eu/doc-configer using the following config string:
// ${JSON.stringify(data)}
import { ${data.enums.map((e) => e.label).join(', ')} } from ./typeSheet.ts; // importing all the types

// types
${data.types.map((t) => getTypeMap(t)).join('\n\n')}
${
  withDatabaseType
    ? `
// this type defines the collections that should be defined
${getType(getDatabaseType(data))}`
    : ''
}\n`;

/**
 * Method that creates a typesheet for the objects defined in your model
 * @param data - `DataType`
 * @param withDatabaseType - optional, if set to `false`, will not add `DataBaseType` to typesheet
 * @returns type sheet content
 */
export const getEnumsAndTypesForData = (
  data: DataType,
  withDatabaseType: boolean = true
): string => `// this file is created using a config file on jonasward.eu/doc-configer using the following config string:
// ${JSON.stringify(data)}

// named enums
${data.enums.map((e) => getEnum(e)).join('\n\n')}

// union type of all defined types
export type TypeLabelUnion = ${data.types.map((tD) => `'${tD.label}'`).join('\n | ')};

// types
${data.types.map((t) => getType(t)).join('\n\n')}
${
  withDatabaseType
    ? `
// this type defines the collections that should be defined
${getType(getDatabaseType(data))}`
    : ''
}

// union type
export type UnionType = ${data.types.map((tD) => `${tD.label}`).join('\n | ')};\n`;

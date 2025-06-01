// this filed parse a `DataType` definition into a typescript typesheet

import { DataType, EnumDefinition, FieldDefinition, TypeDefinition } from '@/types';
import { getDataBaseType } from './databaseType';
import { getFieldsWithReferencableForType } from '../defaultOptions';

const getEnum = (enumDef: EnumDefinition) => `export enum ${enumDef.label} {
  ${enumDef.stringValues.map((s) => `${s} = '${s}'`).join(',\n  ')}
};`;

const getField = (field: FieldDefinition) =>
  `${field[0]}${field[4] ? '?' : ''}: ${field[2] ? 'string' : field[1]}${field[3] ? '[]' : ''}`;

const getType = (typeDef: TypeDefinition) => `export type ${typeDef.label} = {
  ${getFieldsWithReferencableForType(typeDef).map(getField).join(';\n  ')};
};`;

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

// types
${data.types.map((t) => getType(t)).join('\n\n')}
${
  withDatabaseType
    ? `
// this type defines the collections that should be defined
${getType(getDataBaseType(data))}`
    : ''
}\n`;

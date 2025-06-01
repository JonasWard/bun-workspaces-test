import { EnumDefinition } from './enumObject';
import { TypeDefinition } from './typeDefinition';

export type DataTypeV1 = {
  enums: { label: string; stringValues: string[] }[];
  types: { label: string; fields: [string, string, boolean, boolean, boolean][]; canReference: boolean }[];
};

export type DataTypeV2 = {
  version: 2;
  enums: EnumDefinition[];
  types: TypeDefinition[];
};

export type DataType = DataTypeV2;

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

export type DataTypeV3 = {
  version: 3;
  enums: EnumDefinition[];
  types: TypeDefinition[];
  databaseTypeLocal: Record<string, Record<string, string>>;
  databaseTypeView: Record<string, Record<string, string[]>>;
};

export type AllPreviousDataTypes = DataTypeV1 | DataTypeV2 | DataTypeV3;
export type AllFromV2DataTypes = DataTypeV2 | DataTypeV3;

export type DataType = DataTypeV3;

import { FieldBaseType, TypeDefinition, FieldDefinition, EnumDefinition, DataType } from '@/types';

const StringObject = { label: FieldBaseType.string, fields: [], canReference: false };
const NumberObject = { label: FieldBaseType.number, fields: [], canReference: false };
const BooleanObject = { label: FieldBaseType.boolean, fields: [], canReference: false };

export const BaseObjectDefinitions: TypeDefinition[] = [StringObject, NumberObject, BooleanObject];
export const DefaultObject: TypeDefinition = {
  label: 'new object',
  fields: [],
  canReference: true
};
export const DefaultField: FieldDefinition = ['new field', 'string', false, false, false];
export const DefaultEnum: EnumDefinition = {
  label: 'an enum',
  stringValues: ['value 1', 'value 2']
};
export const DefaultBaseObjectDefinitions: DataType = {
  version: 2,
  enums: [DefaultEnum],
  types: [{ label: 'something', fields: [DefaultField], canReference: false }]
};

const getReferencableFields = (typeName: string): FieldDefinition[] => [
  ['_id', 'string', false, false, false],
  ['type', `'${typeName}'`, false, false, false]
];

export const getFieldsWithReferencableForType = (typeDef: TypeDefinition) => [
  ...(typeDef.canReference ? getReferencableFields(typeDef.label) : []),
  ...typeDef.fields
];

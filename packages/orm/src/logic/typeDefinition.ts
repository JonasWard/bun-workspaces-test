// labelname, type, isReference, isArray, isNullable / optional

import { FieldDefinition } from '@/types';

export const getFieldLabelName = (f: FieldDefinition): string => f[0];
export const getFieldType = (f: FieldDefinition): string => f[1];
export const isFieldReference = (f: FieldDefinition): boolean => f[2];
export const isFieldArray = (f: FieldDefinition): boolean => f[3];
export const isFieldOptional = (f: FieldDefinition): boolean => f[4];

const getUpdateFieldDefinition = (
  original: FieldDefinition,
  labelName?: string,
  typeName?: string,
  isReference?: boolean,
  isArray?: boolean,
  isOptional?: boolean
): FieldDefinition => [
  labelName ?? getFieldLabelName(original),
  typeName ?? getFieldType(original),
  isReference ?? isFieldReference(original),
  isArray ?? isFieldArray(original),
  isOptional ?? isFieldOptional(original)
];

export const getUpdatedFieldLabelName = (origin: FieldDefinition, labelName: string) =>
  getUpdateFieldDefinition(origin, labelName);
export const getUpdatedFieldType = (origin: FieldDefinition, typeName: string, isReference?: boolean) =>
  getUpdateFieldDefinition(origin, undefined, typeName, isReference);
export const getUpdatedIsFieldReference = (origin: FieldDefinition, isReference: boolean) =>
  getUpdateFieldDefinition(origin, undefined, undefined, isReference);
export const getUpdatedIsFieldArray = (origin: FieldDefinition, isArray: boolean) =>
  getUpdateFieldDefinition(origin, undefined, undefined, undefined, isArray);
export const getUpdatedIsFieldOptional = (origin: FieldDefinition, isOptional: boolean) =>
  getUpdateFieldDefinition(origin, undefined, undefined, undefined, undefined, isOptional);

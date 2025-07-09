import { ReservedStrings } from '@/enums';

type baseFieldDefinition<T extends string> = [T, string, boolean, boolean, boolean];

export type FieldDefinition = baseFieldDefinition<string>; // labelname, type, isReference, isArray, isNullable / optional
export type FieldDefinitionReserved = baseFieldDefinition<ReservedStrings>; // labelname, type, isReference, isArray, isNullable / optional

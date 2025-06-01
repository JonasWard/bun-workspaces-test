import { FieldDefinition } from './fieldDefinition';

export type TypeDefinition = { label: string; fields: FieldDefinition[]; canReference: boolean };

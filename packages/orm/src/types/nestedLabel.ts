import { PLACEHOLDER_TYPE_STRING } from '../logic';

export type NestedLabelMap = { [typeName: string]: { [fieldName: string]: string } };
export type NestedLabelType = { [PLACEHOLDER_TYPE_STRING]: string; [fieldName: string]: string | NestedLabelType };

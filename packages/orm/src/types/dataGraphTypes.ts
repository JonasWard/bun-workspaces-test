import { DBType } from './dbType';

export type RenderType = 'string' | 'image' | 'number' | 'boolean' | 'button' | 'enum';
export type NestedReferences<T extends DBType> =
  | string
  | [string, RenderType]
  | [string, NestedReferences<T>, RenderType | undefined]
  | [string, keyof T, NestedReferences<T>, RenderType | undefined];
export type FlatReferences =
  | [string, string, string, RenderType | undefined]
  | [string, string, RenderType | undefined]
  | [string, RenderType];
export type FlatRecord = Record<string, FlatReferences[]>;

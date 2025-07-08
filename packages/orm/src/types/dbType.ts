import { ReservedStrings } from '../enums';

type FlatContent = string | boolean | number | ObjectType;

export type ObjectType = { [name: string]: FlatContent | FlatContent[]; [ReservedStrings.Type]: string };
export type DBType = Record<string, (ObjectType & { [ReservedStrings.Id]: string })[]>;

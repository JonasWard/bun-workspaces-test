type FlatContent = string | boolean | number | ObjectType;

export type ObjectType = { [name: string]: FlatContent | FlatContent[]; type: string };
export type DBType = Record<string, (ObjectType & { _id: string })[]>;

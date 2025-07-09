export const ID_S = '_id'
export const TYPE_S = 'type'
export const DATABASE_TYPE_S = 'DatabaseType'

export const ReservedStringsArray = [
  ID_S,
  TYPE_S,
  DATABASE_TYPE_S
] as const;

export type ReservedStrings = typeof ReservedStringsArray[number]
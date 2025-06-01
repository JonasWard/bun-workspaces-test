export const isCamelCase = new RegExp('^[a-z]+(?:[A-Z0-9][a-z0-9]+)*$');
export const isPascalCase = new RegExp('^[A-Z][a-z]+(?:[A-Z][a-z]+)*$');
export const getOccurenceCountForStringArray = (strings: string[]): Record<string, number> => {
  const stringOccurenceCountMap = Object.fromEntries(new Set(strings).values().map((l) => [l, 0]));
  strings.forEach((o) => (stringOccurenceCountMap[o] += 1));
  return stringOccurenceCountMap;
};

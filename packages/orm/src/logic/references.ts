import { BaseObjectDefinitions } from './defaultOptions';
import { getOccurenceCountForStringArray } from './helper/stringHelpers';
import { DataType } from '@/types';

export const getValidReferenceTypes = (data: DataType) => {
  const includingDefaultTypes = [...BaseObjectDefinitions, ...data.types, ...data.enums];
  const labelMap = getOccurenceCountForStringArray(includingDefaultTypes.map((o) => o.label));
  return includingDefaultTypes.filter((o) => labelMap[o.label] < 2);
};

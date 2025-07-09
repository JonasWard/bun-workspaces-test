import { ReservedStrings, ReservedStringsArray } from '@/enums';
import { ValidationStateType } from '@/types';
import { isCamelCase } from '../helper';

export const getFieldLabelValidationState = (s: any): ValidationStateType[] => {
  console.log(s);
  if (typeof s !== 'string' || s.length < 2 || ReservedStringsArray.includes(s as ReservedStrings))
    return ['invalidLabel'];
  if (!isCamelCase.test(s)) return ['formattingIssue'];
  return ['normal'];
};

export const ValidationStates = [
  'normal', // no issue
  'formattingIssue', // warning
  'invalidLabel', // when the label is invalid
  'duplicate', // error
  'loop', // error
  'typeMissing'
] as const;

export const ValidationStateSevereness: Record<ValidationStateType, number> = {
  normal: 0,
  formattingIssue: 1,
  invalidLabel: 2,
  duplicate: 2,
  loop: 3,
  typeMissing: 2
};

export const getRenderclassForSevereness = (s: number) => {
  if (s < 1) return 'none';
  if (s < 2) return 'warning';
  if (s < 3) return 'error';
  return 'stop-what-you-are-doing-and-listen';
};

export const getRenderclassForValidationState = (vs: ValidationStateType[]) =>
  getRenderclassForSevereness(Math.max(...vs.map((v) => ValidationStateSevereness[v])));

export type ValidationStateType = (typeof ValidationStates)[number];

export type ValidationFieldMap = Record<string, ValidationStateType[]>;
export type ValidationObjectMap = Record<string, ValidationStateType[]>;

export enum ValidationStates {
  normal = 'normal', // no issue
  formattingIssue = 'formattingIssue', // warning
  duplicate = 'duplicate', // error
  loop = 'loop', // error
  typeMissing = 'typeMissing'
}

export type ValidationFieldMap = Record<string, ValidationStates>;
export type ValidationObjectMap = Record<string, ValidationStates>;

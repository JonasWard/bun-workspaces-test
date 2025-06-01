import { TypeDefinition } from '@/types/typeDefinition';
import { ValidationFieldMap, ValidationObjectMap, ValidationStates } from '@/types/validationType';
import { getOccurenceCountForStringArray, isCamelCase, isPascalCase } from './helper/stringHelpers';
import { FieldDefinition } from '@/types/fieldDefinition';
import { DataType } from '@/types/dataType';
import { EnumDefinition } from '@/types/enumObject';

export const getStringValidationStateForEnumDefinition = (e: EnumDefinition): ValidationFieldMap => {
  // checking out whether all the fields are unique
  const fieldLabelOccurenceMap = getOccurenceCountForStringArray(e.stringValues);
  return Object.fromEntries(
    Object.entries(fieldLabelOccurenceMap).map(([label, value]) => [
      label,
      value === 1
        ? isCamelCase.test(label)
          ? ValidationStates.normal
          : ValidationStates.formattingIssue
        : ValidationStates.duplicate
    ])
  );
};

export const getFieldValidationStateForObjectDefinition = (o: TypeDefinition): ValidationFieldMap => {
  // checking out whether all the fields are unique
  const fieldLabelOccurenceMap = getOccurenceCountForStringArray(o.fields.map(([label]) => label));
  return Object.fromEntries(
    Object.entries(fieldLabelOccurenceMap).map(([label, value]) => [
      label,
      value === 1
        ? isCamelCase.test(label)
          ? ValidationStates.normal
          : ValidationStates.formattingIssue
        : ValidationStates.duplicate
    ])
  );
};

export const getObjectValidationStateForObjectDefinitions = (os: TypeDefinition[]): ValidationObjectMap => {
  const fieldLabelOccurenceMap = getOccurenceCountForStringArray(os.map(({ label }) => label));
  return Object.fromEntries(
    Object.entries(fieldLabelOccurenceMap).map(([label, value]) => [
      label,
      value === 1
        ? isPascalCase.test(label)
          ? ValidationStates.normal
          : ValidationStates.formattingIssue
        : ValidationStates.duplicate
    ])
  );
};

const fieldTypes = ['string', 'string', 'boolean', 'boolean', 'boolean'];

const parseFieldFromJsonObject = (jsonObject: object): FieldDefinition => {
  if (!Array.isArray(jsonObject)) throw new Error("field definition isn't is an array");
  const array = Array(...jsonObject);
  if (array.length !== fieldTypes.length) throw new Error('not enough entries in field definition');
  if (!array.every((f, index) => typeof f === fieldTypes[index]))
    throw new Error("some entries in the fieldtype don't match");
  return array as unknown as FieldDefinition;
};

const parseFieldsFromJsonObject = (jsonObject: object): FieldDefinition[] => {
  if (!Array.isArray(jsonObject)) throw new Error("field definition array isn't is an array");
  const array = Array(...jsonObject);
  return array.map(parseFieldFromJsonObject);
};

const parseObjectAsObjectDefinition = (jsonObject: object): TypeDefinition => {
  if (typeof (jsonObject as TypeDefinition).label !== 'string') throw new Error('label missing or wrongly formatted');
  if (typeof (jsonObject as TypeDefinition).canReference !== 'boolean')
    throw new Error('canReference flag is missing or wrongly formatted');
  if (!(jsonObject as TypeDefinition).fields) throw new Error('fields atttribute not defined');
  return {
    label: (jsonObject as TypeDefinition).label,
    canReference: (jsonObject as TypeDefinition).canReference,
    fields: parseFieldsFromJsonObject((jsonObject as TypeDefinition).fields)
  };
};

const parseEnumFromJsonObject = (jsonObject: object): EnumDefinition => {
  if (typeof (jsonObject as EnumDefinition).label !== 'string') throw new Error('label missing or wrongly formatted');
  if (!Array.isArray((jsonObject as EnumDefinition).stringValues)) throw new Error("stringValues isn't an array");
  if (!(jsonObject as EnumDefinition).stringValues.every((v) => typeof v === 'string'))
    throw new Error('not all values are formatted as string');
  return {
    label: (jsonObject as TypeDefinition).label,
    stringValues: [...(jsonObject as EnumDefinition).stringValues]
  };
};

export const parseJSONAsObjectsAndEnums = (jsonObject: object): DataType => {
  if (typeof (jsonObject as DataType)?.enums !== 'object' || !Array.isArray((jsonObject as DataType).enums))
    throw new Error('enums definition is missing or wrongly formatted');
  if (typeof (jsonObject as DataType)?.types !== 'object' || !Array.isArray((jsonObject as DataType).types))
    throw new Error('types definition is missing or wrongly formatted');
  if ((jsonObject as DataType)?.version !== 2) console.warn('version type is not matching the definition');

  return {
    version: 2,
    types: Array(...(jsonObject as DataType).types).map(parseObjectAsObjectDefinition),
    enums: Array(...(jsonObject as DataType).enums).map(parseEnumFromJsonObject)
  };
};

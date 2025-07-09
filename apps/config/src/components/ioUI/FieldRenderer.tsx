import {
  FieldDefinition,
  TypeDefinition,
  EnumDefinition,
  ValidationFieldMap,
  isFieldOptional,
  getFieldLabelName,
  getFieldType,
  isFieldArray,
  isFieldReference,
  getUpdatedIsFieldReference,
  getUpdatedIsFieldArray,
  getUpdatedIsFieldOptional,
  getUpdatedFieldLabelName,
  getUpdatedFieldType,
  getRenderclassForValidationState
} from 'orm';
import { TextInput } from './TextInput';

export const FieldRenderer: React.FC<{
  field: FieldDefinition;
  updateField: (newField: FieldDefinition) => void;
  deleteField: () => void;
  validReferenceTypes: (TypeDefinition | EnumDefinition)[];
  fieldValidationStates: ValidationFieldMap;
}> = ({ field, updateField, deleteField, validReferenceTypes, fieldValidationStates }) => (
  <>
    <TextInput
      className={`bg-stone-100 rounded-lg p-1 field-state ${getRenderclassForValidationState(
        fieldValidationStates[getFieldLabelName(field)]
      )}`}
      stateValue={getFieldLabelName(field)}
      onChange={(v) => updateField(getUpdatedFieldLabelName(field, v))}
    />
    <span
      className={`bg-stone-100 rounded-lg p-1 flex flex-row  w-full justify-between field-state ${getRenderclassForValidationState(
        validReferenceTypes.find(({ label }) => getFieldType(field) === label)
          ? fieldValidationStates[getFieldLabelName(field)]
          : ['typeMissing', ...fieldValidationStates[getFieldLabelName(field)]]
      )}`}
    >
      <select
        value={getFieldType(field)}
        onChange={(v) =>
          updateField(
            getUpdatedFieldType(
              field,
              v.target.value,
              (validReferenceTypes.find((o) => o.label === v.target.value) as TypeDefinition | undefined)?.canReference
                ? isFieldReference(field)
                : false
            )
          )
        }
      >
        {validReferenceTypes.map((o) => (
          <option value={o.label}>{o.label}</option>
        ))}
      </select>
      <span className="p-1 flex flex-row gap-1">
        <input
          type="checkbox"
          checked={isFieldReference(field)}
          disabled={
            !(validReferenceTypes.find((o) => o.label === getFieldType(field)) as TypeDefinition | undefined)
              ?.canReference
          }
          id="isReference"
          onChange={() =>
            updateField(
              getUpdatedIsFieldReference(
                field,
                (validReferenceTypes.find((o) => o.label === getFieldType(field)) as TypeDefinition | undefined)
                  ?.canReference
                  ? !isFieldReference(field)
                  : false
              )
            )
          }
        />
        <span
          className={
            (validReferenceTypes.find((o) => o.label === getFieldType(field)) as TypeDefinition | undefined)
              ?.canReference
              ? ''
              : 'text-[#7a7a7a]'
          }
        >
          id
        </span>
      </span>
      <span className="p-1 flex flex-row gap-1">
        <input
          type="checkbox"
          checked={isFieldArray(field)}
          id="isReference"
          onChange={() => updateField(getUpdatedIsFieldArray(field, !isFieldArray(field)))}
        />
        <span>[]</span>
      </span>
      <span className="p-1 flex flex-row gap-1">
        <input
          type="checkbox"
          checked={isFieldOptional(field)}
          id="isReference"
          onChange={() => updateField(getUpdatedIsFieldOptional(field, !isFieldOptional(field)))}
        />
        <span>?</span>
      </span>
    </span>
    <button
      className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
      onClick={deleteField}
    >
      - del
    </button>
  </>
);

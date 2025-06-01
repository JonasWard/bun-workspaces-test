import { FieldDefinition, TypeDefinition, EnumDefinition, ValidationFieldMap } from 'orm';
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
      className={`bg-stone-100 rounded-lg p-1 field-state ${fieldValidationStates[field[0]]}`}
      stateValue={field[0]}
      onChange={(v) => updateField([v, field[1], field[2], field[3], field[4]])}
    />
    <span
      className={`bg-stone-100 rounded-lg p-1 flex flex-row  w-full justify-between field-state ${
        validReferenceTypes.find(({ label }) => field[1] === label) ? fieldValidationStates[field[0]] : 'typeMissing'
      }`}
    >
      <select
        value={field[1]}
        onChange={(v) =>
          updateField([
            field[0],
            v.target.value,
            (validReferenceTypes.find((o) => o.label === v.target.value) as TypeDefinition | undefined)?.canReference
              ? field[2]
              : false,
            field[3],
            field[4]
          ])
        }
      >
        {validReferenceTypes.map((o) => (
          <option value={o.label}>{o.label}</option>
        ))}
      </select>
      <span className="p-1 flex flex-row gap-1">
        <input
          type="checkbox"
          checked={field[2]}
          disabled={
            !(validReferenceTypes.find((o) => o.label === field[1]) as TypeDefinition | undefined)?.canReference
          }
          id="isReference"
          onChange={() =>
            updateField([
              field[0],
              field[1],
              (validReferenceTypes.find((o) => o.label === field[1]) as TypeDefinition | undefined)?.canReference
                ? !field[2]
                : false,
              field[3],
              field[4]
            ])
          }
        />
        <span
          className={
            (validReferenceTypes.find((o) => o.label === field[1]) as TypeDefinition | undefined)?.canReference
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
          checked={field[3]}
          id="isReference"
          onChange={() => updateField([field[0], field[1], field[2], !field[3], field[4]])}
        />
        <span>[]</span>
      </span>
      <span className="p-1 flex flex-row gap-1">
        <input
          type="checkbox"
          checked={field[4]}
          id="isReference"
          onChange={() => updateField([field[0], field[1], field[2], field[3], !field[4]])}
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

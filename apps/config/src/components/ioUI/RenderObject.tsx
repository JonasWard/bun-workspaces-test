import { TextInput } from './TextInput';
import { FieldRenderer } from './FieldRenderer';
import { useEffect, useRef } from 'react';
import {
  TypeDefinition,
  EnumDefinition,
  ValidationObjectMap,
  getFieldValidationStateForObjectDefinition,
  DefaultField
} from 'orm';

export const RenderObject: React.FC<{
  o: TypeDefinition;
  updateObject: (o: TypeDefinition) => void;
  deleteObject: () => void;
  validReferenceTypes: (TypeDefinition | EnumDefinition)[];
  objectValidationStates: ValidationObjectMap;
  setTypeLabelInFocus: (label: string) => void;
  setViewLabelInFocus: (label: string) => void;
  setLocalLabelInFocus: (label: string) => void;
  labelInFocus: string;
}> = ({
  o,
  updateObject,
  deleteObject,
  validReferenceTypes,
  objectValidationStates,
  setTypeLabelInFocus,
  setViewLabelInFocus,
  setLocalLabelInFocus,
  labelInFocus
}) => {
  const fieldValidationStates = getFieldValidationStateForObjectDefinition(o);
  const divRef = useRef(null);

  useEffect(() => {
    if (labelInFocus && labelInFocus === o.label && divRef.current)
      (divRef.current as any).focus({ preventScroll: false, focusVisible: true });
  }, [labelInFocus]);

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2 object-state w-160">
      <div
        className={`grid gap-1 grid-cols-[4fr_3fr_2fr_auto] gap-4 p-1 rounded-lg object-state ${
          objectValidationStates[o.label]
        }`}
      >
        <TextInput onChange={(label) => updateObject({ ...o, label })} stateValue={o.label} />
        <span className="p-1 flex flex-row gap-1">
          <input
            type="checkbox"
            checked={o.canReference}
            onChange={() => updateObject({ ...o, canReference: !o.canReference })}
          />
          <span>can reference</span>
        </span>

        <button
          className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
          onClick={deleteObject}
        >
          - del
        </button>
        <span className="flex flex-row gap-2">
          <button
            className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
            ref={divRef}
            onClick={() => setTypeLabelInFocus(o.label)}
          >
            T
          </button>
          <button
            className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
            ref={divRef}
            onClick={() => setViewLabelInFocus(o.label)}
          >
            👀
          </button>
          <button
            className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
            ref={divRef}
            onClick={() => setLocalLabelInFocus(o.label)}
          >
            📖
          </button>
        </span>
      </div>
      <div className="grid gap-1 grid-cols-[1fr_auto_60px]">
        {o.fields.map((field, i) => (
          <FieldRenderer
            key={i}
            field={field}
            updateField={(f) => updateObject({ ...o, fields: [...o.fields.slice(0, i), f, ...o.fields.slice(i + 1)] })}
            deleteField={() => updateObject({ ...o, fields: [...o.fields.slice(0, i + 1), ...o.fields.slice(i)] })}
            validReferenceTypes={validReferenceTypes}
            fieldValidationStates={fieldValidationStates}
          />
        ))}
        <button
          className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
          onClick={() => updateObject({ ...o, fields: [...o.fields, DefaultField] })}
        >
          + add field
        </button>
      </div>
    </div>
  );
};

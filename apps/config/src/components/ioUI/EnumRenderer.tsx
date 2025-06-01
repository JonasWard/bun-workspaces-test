import { TextInput } from './TextInput';
import { EnumDefinition, ValidationObjectMap, getStringValidationStateForEnumDefinition } from 'orm';

export const EnumRenderer: React.FC<{
  e: EnumDefinition;
  updateEnum: (o: EnumDefinition) => void;
  deleteEnum: () => void;
  objectValidationStates: ValidationObjectMap;
}> = ({ e, updateEnum, deleteEnum, objectValidationStates }) => {
  const stringValidationStates = getStringValidationStateForEnumDefinition(e);

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2 object-state">
      <div
        className={`grid gap-1 grid-cols-[3fr_1fr_auto] p-1 rounded-lg object-state ${objectValidationStates[e.label]}`}
      >
        <TextInput onChange={(label) => updateEnum({ ...e, label })} stateValue={e.label} />

        <button
          className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
          onClick={deleteEnum}
        >
          - del
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {e.stringValues.map((label, i) => (
          <div
            className={`grid gap-1 grid-cols-[3fr_1fr_auto] p-1 rounded-lg field-state ${
              objectValidationStates[e.label]
            }`}
          >
            <TextInput
              key={i}
              onChange={(newLabel) =>
                updateEnum({
                  ...e,
                  stringValues: [...e.stringValues.slice(0, i), newLabel, ...e.stringValues.slice(i + 1)]
                })
              }
              stateValue={label}
            />

            <button
              className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
              onClick={() =>
                updateEnum({ ...e, stringValues: [...e.stringValues.slice(0, i), ...e.stringValues.slice(i + 1)] })
              }
            >
              - del
            </button>
          </div>
        ))}
        <button
          className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
          onClick={() =>
            updateEnum({
              ...e,
              stringValues: [...e.stringValues, 'new value']
            })
          }
        >
          + add option
        </button>
      </div>
    </div>
  );
};

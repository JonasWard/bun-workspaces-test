import { EnumDefinition, ValidationObjectMap, DefaultEnum } from 'orm';
import { EnumRenderer } from './EnumRenderer';

export const EnumDefinitionsRenderer: React.FC<{
  enums: EnumDefinition[];
  setEnums: (newEnums: EnumDefinition[]) => void;
  objectValidationStates: ValidationObjectMap;
}> = ({ enums, setEnums, objectValidationStates }) => {
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,315px)] flex-wrap gap-2 text-slate-950 rounded-lg p-2">
        {enums.map((e, i) => (
          <EnumRenderer
            e={e}
            updateEnum={(e) => setEnums([...enums.slice(0, i), e, ...enums.slice(i + 1)])}
            deleteEnum={() => setEnums([...enums.slice(0, i), ...enums.slice(i + 1)])}
            key={i}
            objectValidationStates={objectValidationStates}
          />
        ))}
      </div>
      <button
        className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
        onClick={() => setEnums([...enums, DefaultEnum])}
      >
        + add enum
      </button>
    </>
  );
};

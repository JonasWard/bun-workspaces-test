import { TextInput } from '../TextInput';

const RowRenderer: React.FC<{
  viewName: string;
  validOptions: string[];
  checkedOptions: string[];
  setCheckedOptions: (newOptions: [string, string[]]) => void;
}> = ({ viewName, validOptions, checkedOptions, setCheckedOptions }) => (
  <>
    <TextInput
      className="bg-gray-200 rounded-[4px] px-[6px] py-[1px]"
      stateValue={viewName}
      onChange={(s) => setCheckedOptions([s.replaceAll(' ', '-'), checkedOptions])}
    />
    {validOptions.map((o) => (
      <input
        key={`${viewName}-${o}`}
        type="checkbox"
        checked={checkedOptions.includes(o)}
        className="w-4 h-4 p-2"
        onChange={(v) =>
          Boolean(v.target.value)
            ? checkedOptions.includes(o)
              ? null
              : setCheckedOptions([viewName, [...checkedOptions, o]])
            : setCheckedOptions([viewName, checkedOptions.filter((cO) => cO !== o)])
        }
      />
    ))}
  </>
);

export const EditViewsForType: React.FC<{
  typeName: string;
  validOptions: string[];
  currentOptions: Record<string, string[]>;
  localValue: Record<string, string>;
  setOptions: (newOptions: Record<string, string[]>) => void;
}> = ({ typeName, validOptions, currentOptions, localValue, setOptions }) => (
  <div>
    <div
      className="grid items-center gap-2"
      style={{
        gridTemplateColumns: `250px ${Object.keys(validOptions)
          .map(() => '20px')
          .join(' ')} 30px`
      }}
    >
      <span className="h-[160px]">{typeName}</span>
      {validOptions.map((s) => (
        <span
          style={{ direction: 'rtl' }}
          className="origin-top-left w-[200px] h-[20px] overflow-clip text-left text-ellipsis rotate-315 translate-y-[80px]"
        >
          {localValue[s] ?? s}
        </span>
      ))}
      <span> </span>
      {Object.entries(currentOptions).map(([viewName, checkedOptions], i, arr) => (
        <>
          <RowRenderer
            viewName={viewName}
            validOptions={validOptions}
            checkedOptions={checkedOptions}
            setCheckedOptions={(newOptions: [string, string[]]) => {
              arr.splice(i, 1, newOptions);
              setOptions(Object.fromEntries(arr));
            }}
          />
          <button
            onClick={() =>
              setOptions(
                Object.fromEntries(
                  Object.entries(currentOptions).filter(([localViewName]) => viewName !== localViewName)
                )
              )
            }
          >
            -
          </button>
        </>
      ))}
    </div>
    <button onClick={() => setOptions({ ...currentOptions, ['new view']: [] })}>+</button>
  </div>
);

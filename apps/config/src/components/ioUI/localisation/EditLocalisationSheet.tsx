import { TextInput } from '../TextInput';

export const EditLocalisationSheet: React.FC<{
  typeName: string;
  locals: Record<string, string>;
  setLocals: (newOptions: Record<string, string>) => void;
}> = ({ typeName, locals, setLocals }) => (
  <div
    className="grid items-center gap-2"
    style={{
      gridTemplateColumns: '250px 200px'
    }}
  >
    <span>{typeName}</span>
    <span />
    <span>entry</span>
    <span>local</span>
    {Object.entries(locals).map(([entryName, local]) => (
      <>
        <span key={`${entryName}-name`} style={{ direction: 'rtl' }} className="overflow-hidden text-ellipsis">
          {entryName}
        </span>
        <TextInput
          className="bg-gray-200 w-[300px] rounded-[4px] px-[6px] py-[1px]"
          key={`${entryName}-input`}
          stateValue={local}
          onChange={(newLocal) => setLocals({ ...locals, [entryName]: Boolean(newLocal) ? newLocal : entryName })}
        />
      </>
    ))}
  </div>
);

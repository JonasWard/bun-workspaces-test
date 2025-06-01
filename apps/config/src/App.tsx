import './index.css';
import { useEffect, useState } from 'react';
import { LoadJSON } from './components/ioUI/LoadJSON';
import { SaveJSON } from './components/ioUI/SaveJSON';
import { TypeRenderer } from './components/visualisation/TypeRenderer';
import { DataType, ExampleDataType, getValidReferenceTypes } from 'orm';
import { EnumDefinitionsRenderer } from './components/ioUI/EnumDefinitionsRenderer';
import { ObjectDefinitionsRenderer } from './components/ioUI/ObjectDefinitionsRenderer';
import { DownloadTypeSheet } from './components/ioUI/DownloadTypeSheet';

export function App() {
  const [data, setData] = useState<DataType>(ExampleDataType);
  const [labelInFocus, setLabelInFocus] = useState<string | undefined>();
  const [typeShowDetails, setTypeShowDetails] = useState(false);

  return (
    <>
      <div className="h-[60px] text-black">
        <span className="flex flex-row gap-10 p-2 items-center">
          <LoadJSON setData={setData} />
          <SaveJSON data={data} />
          {labelInFocus ? (
            <button
              className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
              onClick={() => setLabelInFocus(undefined)}
            >
              x hide type visualization
            </button>
          ) : null}
          <button
            className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
            onClick={() => setLabelInFocus('DatabaseType')}
          >
            view DatabaseType
          </button>
          <span className="flex flex-row gap-2">
            <input type="checkbox" checked={typeShowDetails} onChange={() => setTypeShowDetails(!typeShowDetails)} />
            <span>show details</span>
          </span>
          <DownloadTypeSheet data={data} />
        </span>
      </div>
      <div
        className={`grid w-full h-[calc(100svh-60px)] gap-6 ${
          labelInFocus ? 'grid-cols-[1fr_1fr]' : 'grid-cols-[1fr]'
        }`}
      >
        <div className="max-h-[calc(100svh-60px-16px)] overflow-y-scroll">
          <div className="m-4">
            <EnumDefinitionsRenderer
              enums={data.enums}
              setEnums={(enums) => setData({ ...data, enums })}
              objectValidationStates={{}}
            />
            <ObjectDefinitionsRenderer
              objects={data.types}
              updateObjects={(types) => setData({ ...data, types })}
              validReferenceTypes={getValidReferenceTypes(data)}
              setLabelInFocus={setLabelInFocus}
              labelInFocus={labelInFocus ?? ''}
            />
          </div>
        </div>
        <div className="max-h-[calc(100svh-60px-16px)] overflow-scroll overflow-x-auto">
          <div className="m-4">
            <TypeRenderer label={labelInFocus} setLabel={setLabelInFocus} data={data} showDetails={typeShowDetails} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

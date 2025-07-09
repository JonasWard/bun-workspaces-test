import './index.css';
import { useEffect, useState } from 'react';
import { LoadJSON } from './components/ioUI/LoadJSON';
import { SaveJSON } from './components/ioUI/SaveJSON';
import { TypeRenderer } from './components/visualisation/TypeRenderer';
import { DATABASE_TYPE_S, DataType, ExampleDataType, getValidReferenceTypes } from 'orm';
import { EnumDefinitionsRenderer } from './components/ioUI/EnumDefinitionsRenderer';
import { ObjectDefinitionsRenderer } from './components/ioUI/ObjectDefinitionsRenderer';
import { DownloadTypeSheet } from './components/ioUI/DownloadTypeSheet';
import { EditViewsForType } from './components/ioUI/views/EditViewsForType';
import { EditLocalisationSheet } from './components/ioUI/localisation/EditLocalisationSheet';
import { DownloadTypeMap } from './components/ioUI/DownloadTypeMap';
import { DownloadSpringBootBackend } from './components/ioUI/DownloadSpringBootBackend';

export const App = () => {
  const [data, setData] = useState<DataType>(ExampleDataType);
  const [typeLabelRendererInFocus, setTypeLabelRendererInFocus] = useState<string | undefined>();
  const [viewLabelRendererInFocus, setViewLabelRendererInFocus] = useState<string | undefined>();
  const [localLabelRendererInFocus, setLocalLabelRendererInFocus] = useState<string | undefined>();
  const [typeShowDetails, setTypeShowDetails] = useState(false);

  const upsertTypeLabel = (typeLabel?: string) => {
    if (typeLabel === undefined) setTypeLabelRendererInFocus(undefined);
    else {
      setTypeLabelRendererInFocus(typeLabel);
      setViewLabelRendererInFocus(undefined);
      setLocalLabelRendererInFocus(undefined);
    }
  }

  const upsertViewLabel = (viewLabel?: string) => {
    if (viewLabel === undefined) setViewLabelRendererInFocus(undefined);
    else {
      setViewLabelRendererInFocus(viewLabel);
      setTypeLabelRendererInFocus(undefined);
      setLocalLabelRendererInFocus(undefined);
    }
  }

  const upsertLocalLabel = (localLabel?: string) => {
    if (localLabel === undefined) setViewLabelRendererInFocus(undefined);
    else {
      setViewLabelRendererInFocus(undefined);
      setTypeLabelRendererInFocus(undefined);
      setLocalLabelRendererInFocus(localLabel);
    }
  }

  useEffect(() => {
    console.log(data);
  }, [data])

  return (
    <>
      <div className="h-[60px] text-black">
        <span className="flex flex-row gap-10 p-2 items-center">
          <LoadJSON setData={setData} />
          <SaveJSON data={data} />
          {typeLabelRendererInFocus ? (
            <button
              className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
              onClick={() => upsertTypeLabel()}
            >
              x hide type visualization
            </button>
          ) : null}
          <button
            className="bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded-lg font-bold text-sm min-w-[0px] appearance-none cursor-pointer hover:bg-[#f3d5a3] transition-colors duration-100"
            onClick={() => upsertTypeLabel(DATABASE_TYPE_S)}
          >
            view DatabaseType
          </button>
          <span className="flex flex-row gap-2">
            <input type="checkbox" checked={typeShowDetails} onChange={() => setTypeShowDetails(!typeShowDetails)} />
            <span>show details</span>
          </span>
          <DownloadTypeSheet data={data} />
          <DownloadTypeMap data={data} />
          <DownloadSpringBootBackend data={data} />
        </span>
      </div>
      <div
        className={`grid w-full h-[calc(100svh-60px)] gap-6 ${
          (typeLabelRendererInFocus ?? viewLabelRendererInFocus ?? localLabelRendererInFocus) ? 'grid-cols-[1fr_1fr]' : 'grid-cols-[1fr]'
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
              setTypeLabelInFocus={upsertTypeLabel}
              setViewLabelInFocus={upsertViewLabel}
              setLocalLabelInFocus = {upsertLocalLabel}
              labelInFocus={typeLabelRendererInFocus ?? viewLabelRendererInFocus ?? ''}
            />
          </div>
        </div>
        <div className="max-h-[calc(100svh-60px-16px)] overflow-scroll overflow-x-auto">
          <div className="m-4">
            {typeLabelRendererInFocus ? <TypeRenderer label={typeLabelRendererInFocus} setLabel={upsertTypeLabel} data={data} showDetails={typeShowDetails} /> : null}
            {viewLabelRendererInFocus ? <EditViewsForType localValue={data.databaseTypeLocal[viewLabelRendererInFocus] ?? {}} typeName={viewLabelRendererInFocus} validOptions={Object.keys(data.databaseTypeLocal[viewLabelRendererInFocus] ?? {})} currentOptions={data.databaseTypeView[viewLabelRendererInFocus] ?? []} setOptions={(newOptions) => setData({...data, databaseTypeView: {...data.databaseTypeView, [viewLabelRendererInFocus]: newOptions}})} /> : null}
            {localLabelRendererInFocus ? <EditLocalisationSheet locals={data.databaseTypeLocal[localLabelRendererInFocus] ?? {}} typeName={localLabelRendererInFocus} setLocals={(newOptions) => setData({...data, databaseTypeLocal: {...data.databaseTypeLocal, [localLabelRendererInFocus]: newOptions}})} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

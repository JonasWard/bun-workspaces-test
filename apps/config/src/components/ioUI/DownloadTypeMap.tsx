import { DataType, getTypeMapForData } from 'orm';

export const DownloadTypeMap: React.FC<{ data: DataType }> = ({ data }) => {
  const downloadTypeMap = () => {
    const blob = new Blob([getTypeMapForData(data)], { type: 'application/ts' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'typeMap.ts';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-stone-100 rounded-lg p-1 flex flex-row" onClick={downloadTypeMap}>
      Download type Map
    </button>
  );
};

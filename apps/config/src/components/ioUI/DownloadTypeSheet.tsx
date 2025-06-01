import { DataType, getEnumsAndTypesForData } from 'orm';

export const DownloadTypeSheet: React.FC<{ data: DataType }> = ({ data }) => {
  const downloadTypesheet = () => {
    const blob = new Blob([getEnumsAndTypesForData(data)], { type: 'application/ts' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'typeSheet.ts';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-stone-100 rounded-lg p-1 flex flex-row" onClick={downloadTypesheet}>
      Download type sheet
    </button>
  );
};

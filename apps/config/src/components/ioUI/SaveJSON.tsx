import { DataType } from 'orm';

export const SaveJSON: React.FC<{ data: DataType }> = ({ data }) => {
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-stone-100 rounded-lg p-1 flex flex-row" onClick={downloadJson}>
      Download
    </button>
  );
};

import { DataType, getConvexSchemaForData } from 'orm';

export const DownloadConvexSchema: React.FC<{ data: DataType }> = ({ data }) => {
  const downloadConvexSchema = () => {
    const blob = new Blob([getConvexSchemaForData(data)], { type: 'application/ts' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'convexSchema.ts';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-stone-100 rounded-lg p-1 flex flex-row" onClick={downloadConvexSchema}>
      Download convex schema
    </button>
  );
};

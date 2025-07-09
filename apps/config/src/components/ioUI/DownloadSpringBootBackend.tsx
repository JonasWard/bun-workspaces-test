import { getJavaZip } from '@/logic/java/createPackage';
import { getDateString } from '@/logic/utils/dataString';
import { DataType } from 'orm';

export const DownloadSpringBootBackend: React.FC<{ data: DataType }> = ({ data }) => {
  const downloadTypeMap = async () => {
    const blob = await getJavaZip(data);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${getDateString()}-SpringBoot.zip`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-stone-100 rounded-lg p-1 flex flex-row" onClick={downloadTypeMap}>
      Download SpringBoot
    </button>
  );
};

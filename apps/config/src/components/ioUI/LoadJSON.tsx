import { DataType, parseJSONAsObjectsAndEnums } from 'orm';

export const LoadJSON: React.FC<{ setData: (newData: DataType) => void }> = ({ setData }) => {
  const handleFileUpload: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = (event) => {
    if (!event?.target.files) return;
    const file = event.target.files[0];
    let readerAlert = undefined;
    if (file && file.type === 'application/json') {
      try {
        const reader = new FileReader();
        reader.onload = (e) => setData(parseJSONAsObjectsAndEnums(JSON.parse(e!.target!.result as string)));
        reader.readAsText(file);
      } catch (e) {
        readerAlert = 'Error parsing JSON: ' + (e as Error).cause;
      }
    } else {
      readerAlert = 'Please upload a valid JSON file.';
    }
    if (readerAlert) alert(readerAlert);
  };

  return (
    <input
      className="bg-stone-100 rounded-lg p-1"
      type="file"
      accept=".json"
      onChange={handleFileUpload}
      placeholder="load from file"
    />
  );
};

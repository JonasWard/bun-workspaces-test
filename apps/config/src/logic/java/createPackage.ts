import JSZip from 'jszip';
import { DataType } from 'orm';

export const getJavaZip = async (t: DataType): Promise<Blob> => {
  const zip = new JSZip();

  zip.file('aFile.ts', "const s: string = 'this-is-that';\n");
  zip.folder('aFolder')!.file('aFileInAFolder.ts', "const s: string = 'this is in a folder!';\n");

  return await zip.generateAsync({ type: 'blob' });
};

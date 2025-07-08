import { Missing } from '@/components/general/Missing';

export const MissingObject: React.FC<{ collectionName?: string; id?: string; renderStyle?: 'tag' | 'full-page' }> = ({
  collectionName,
  id,
  renderStyle = 'tag'
}) => {
  const displayString = `there is no entry with id "${id}" in the collection "${collectionName}"`;

  switch (renderStyle) {
    case 'full-page':
      return <Missing optionalString={displayString} />;
    case 'tag':
    default:
      return (
        <span className="border-2 border-red-700 text-white bg-red-400 rounded-lg p-[1px_6px]">{displayString}</span>
      );
  }
};

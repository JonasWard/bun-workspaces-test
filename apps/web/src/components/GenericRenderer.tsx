type FlatContent = string | number | boolean | object;
type ContentType = FlatContent | FlatContent[];

const EntryRenderer: React.FC<{ content: ContentType }> = ({ content }) => {
  if (typeof content === 'object')
    return (
      <div className="flex flex-column gap-2 bg-zinc-100 p-4">
        {Array.isArray(content) ? (
          content.map((c) => <EntryRenderer content={c} />)
        ) : (
          <GenericRenderer o={content as Record<string, ContentType>} />
        )}
      </div>
    );
  return <span>{content}</span>;
};

export const GenericRenderer: React.FC<{ o: Record<string, ContentType> }> = ({ o }) => (
  <div className="grid grid-cols-[1fr_5fr] gap-2 p-2 bg-zinc-200">
    {Object.entries(o).map(([fieldName, content]) => (
      <>
        <span key={fieldName}>{fieldName}</span>
        <EntryRenderer key={fieldName + '-content'} content={content} />
      </>
    ))}
  </div>
);

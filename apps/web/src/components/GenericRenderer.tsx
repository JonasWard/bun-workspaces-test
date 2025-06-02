type FlatContent = string | number | boolean | object;
type ContentType = FlatContent | FlatContent[];

const EntryRenderer: React.FC<{ fieldName: string; content: ContentType }> = ({ fieldName, content }) => {
  return typeof content === 'object' ? (
    <>
      <details key={fieldName + '-detail'}>
        <summary>{fieldName}</summary>
        <div className="flex flex-column gap-2 bg-zinc-100 p-4">
          {Array.isArray(content) ? (
            content.map((c, i) => <EntryRenderer fieldName={`${fieldName} ${i.toString()}`} content={c} />)
          ) : (
            <GenericRenderer o={content as Record<string, ContentType>} />
          )}
        </div>
      </details>
      <div />
    </>
  ) : (
    <>
      <span key={fieldName}>{fieldName}</span>
      <span key={fieldName + '-content'}>{content}</span>
    </>
  );
};

export const GenericRenderer: React.FC<{ o: Record<string, ContentType> }> = ({ o }) => (
  <div className="grid grid-cols-[1fr_5fr] gap-2 p-2 bg-zinc-200">
    {Object.entries(o).map(([fieldName, content]) => (
      <EntryRenderer key={fieldName} fieldName={fieldName} content={content} />
    ))}
  </div>
);

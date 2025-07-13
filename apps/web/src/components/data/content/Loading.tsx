import { useModelStore } from '@/store/useModelStore';

export const Loading: React.FC<{ optionalString?: string }> = ({ optionalString }) => {
  const loadedCollections = useModelStore((s) => s.loadedCollections);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-slate-200">
      <div className="flex flex-col bg-slate-300 p-3 gap-3 text-slate-700 items-center rounded-lg border-4 border-solid border-slate-100 drop-shadow-lg">
        <span>{`backend is hosted on Render.com free tier`}</span>
        <span>{`which spins down after 15 minutes of inactivity`}</span>
        <span>{`it can take half a minute for the backend to spin up!`}</span>
        <span>{`loaded ${loadedCollections.length} collections`}</span>
        <span>{optionalString ?? 'There is nothing to be seen yet!'}</span>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router';

export const Missing: React.FC<{ optionalString?: string }> = ({ optionalString }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-slate-200">
      <div className="flex flex-col bg-slate-300 p-3 gap-3 text-slate-700 items-center rounded-lg border-4 border-solid border-slate-100 drop-shadow-lg">
        <span>Oops! it seems you took a wrong turn!</span>
        <span>{optionalString ?? 'There is just nothing to be seen here :/'}</span>
        <button onClick={() => navigate('/')}>Go 🏡</button>
      </div>
    </div>
  );
};

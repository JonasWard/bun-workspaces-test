import { Popover } from 'antd';
import { useAuthStore } from '../../../store/useAuthStore';
import { handleLogin } from './logic';
import { TextInput } from '../../../components/data/TextInput';
import { useState } from 'react';

export const Authentication: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  console.log(document.cookie['session_id']);

  return (
    <span>
      {user ? (
        user.username
      ) : (
        <Popover
          content={
            <div className="flex flex-col gap-2">
              <TextInput stateValue={username ?? 'username'} onChange={setUsername} />
              <TextInput stateValue={password ?? 'password'} onChange={setPassword} />
              <button
                disabled={!(username && password)}
                onClick={async () => {
                  if (!(username && password)) return;
                  try {
                    await handleLogin(username, password);
                  } catch (e) {
                    console.log('loginFailed');
                  }
                }}
              >
                login
              </button>
            </div>
          }
        >
          login
        </Popover>
      )}
    </span>
  );
};

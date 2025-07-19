import { useModelStore } from '@/store/useModelStore';
import { Modal } from 'antd';

export const Loading: React.FC<{ optionalString?: string }> = ({ optionalString }) => {
  const loadedCollections = useModelStore((s) => s.loadedCollections);

  return (
    <Modal open closeIcon={null} footer={null}>
      <div className="flex flex-col gap-3 items-center text-base">
        <span>{`backend is hosted on Render.com free tier`}</span>
        <span>{`which spins down after 15 minutes of inactivity`}</span>
        <span>{`it can take half a minute for the backend to spin up!`}</span>
        <span>{`loaded ${loadedCollections.length} collections`}</span>
        <span>{optionalString ?? 'There is nothing to be seen yet!'}</span>
      </div>
    </Modal>
  );
};

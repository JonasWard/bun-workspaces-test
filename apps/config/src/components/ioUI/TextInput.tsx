import { useEffect, useState } from 'react';

export const TextInput: React.FC<{
  stateValue: string;
  className?: string;
  onChange: (v: string) => void;
}> = ({ stateValue, className, onChange }) => {
  const [localState, setLocalState] = useState(stateValue);

  useEffect(() => setLocalState(stateValue), [stateValue]);

  return (
    <input
      onChange={(v) => setLocalState(v.target.value ?? '')}
      onBlur={() => onChange(localState)}
      className={className}
      onKeyDown={(v) => v.key === 'Enter' && onChange(localState)}
      value={localState}
    />
  );
};

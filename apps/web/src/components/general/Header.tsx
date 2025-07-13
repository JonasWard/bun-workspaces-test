import { CSSProperties } from 'react';

export const Header: React.FC<{ className?: string; style?: CSSProperties }> = ({ className, style }) => (
  <div className={`${className} bg-slate-200`}>
    <div className="flex flex-row gap-4 max-w-[min(1200px,100svw)] justify-between p-2 mx-auto" style={style}>
      <span>Slab 2 Reuse</span>
      <span>Something</span>
    </div>
  </div>
);

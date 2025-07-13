import { ReactNode } from 'react';
import { Header } from './Header';

export const Page: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>
    <Header className="h-[50px]" />
    <div className="p-4 max-w-[min(1200px,100svw)] mx-auto max-h-[calc(100svh-50px)] overflow-auto">{children}</div>
  </div>
);

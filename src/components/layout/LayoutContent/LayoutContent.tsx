import type { ReactNode } from 'react';

interface LayoutContentProps {
  children: ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps): JSX.Element {
  return (
    <div className="w-full h-full" id="app-container">
      {children}
    </div>
  );
}

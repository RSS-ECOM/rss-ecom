import type { ReactNode } from 'react';

interface LayoutContentProps {
  children: ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps): JSX.Element {
  return <div id="app-container">{children}</div>;
}

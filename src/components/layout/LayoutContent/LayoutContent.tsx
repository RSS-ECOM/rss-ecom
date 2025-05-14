'use client';

import type { ReactNode } from 'react';

import Footer from '@/components/layout/Footer/Footer';
import Header from '@/components/layout/Header/Header';
import { useAuthSync } from '@/hooks/use-auth-sync';

interface LayoutContentProps {
  children: ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps): JSX.Element {
  useAuthSync();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

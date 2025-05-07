import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import LayoutContent from '@/components/layout/LayoutContent/LayoutContent';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  description:
    "Heavy Metal offers premium quality metal products, tools, and equipment. Looking to protect yourself or deal some damage? We've got you covered!",
  icons: {
    icon: '/favicon.ico',
  },
  title: 'Heavy Metal',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}

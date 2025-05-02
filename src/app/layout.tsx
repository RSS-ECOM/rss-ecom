import '@/styles/globals.scss';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Heavy Metal',
  description: 'Heavy Metal offers premium quality metal products, tools, and equipment. Looking to protect yourself or deal some damage? We\'ve got you covered!',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div id="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import LayoutContent from '@/components/layout/LayoutContent/LayoutContent';
import { Toaster } from '@/components/ui/toaster';
import { CustomerProvider } from '@/lib/customer-client';
import ThemeProvider from '@/providers/theme-provider';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  authors: [{ name: 'Story Hive Team' }],
  description:
    'Story Hive offers a carefully curated collection of books for all ages and interests. Buzzing with great reads for every reader!',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['books', 'reading', 'literature', 'fiction', 'non-fiction', 'bookstore', 'online bookstore'],
  title: 'Story Hive',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CustomerProvider>
            <LayoutContent>{children}</LayoutContent>
            <Toaster />
          </CustomerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

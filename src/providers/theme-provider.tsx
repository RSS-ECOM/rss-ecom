'use client';

import type { ThemeProviderProps } from 'next-themes';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

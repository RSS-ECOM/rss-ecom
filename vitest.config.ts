import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    root: __dirname,
    setupFiles: ['vitest.setup.ts'],
    testTimeout: 10000,
  },
});

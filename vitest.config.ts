import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: ['tests/unit/**/*.test.ts{,x}'],
    // Placeholders only: unit tests never read .env* files' real credentials, and
    // tests/setup.ts additionally blocks all network access.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'unitplaceholder',
      NEXT_PUBLIC_SANITY_DATASET: 'unit',
      SANITY_API_READ_TOKEN: 'unit-placeholder-token',
      POSTMARK_API_KEY: 'unit-placeholder',
      NEXT_PUBLIC_VERIFIED_SENDER: 'unit@example.invalid',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // `server-only` throws outside the React server build; irrelevant for unit tests.
      'server-only': path.resolve(__dirname, './tests/stubs/empty.ts'),
    },
  },
});

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// The extension has two independent entry points:
//  - popup:          the React UI (index.html -> src/extension/popup/main.tsx)
//  - service-worker: the MV3 background script (currently a stub)
// The service worker is emitted with a stable, unhashed name so manifest.json
// can reference it directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        'service-worker': resolve(
          __dirname,
          'src/extension/background/service-worker.ts',
        ),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'service-worker'
            ? 'service-worker.js'
            : 'assets/[name]-[hash].js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
});

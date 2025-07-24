import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  cacheDir: './.vite',
  build: {
    target: 'esnext',
    minify: false,
    commonjsOptions: {
      include: [/node_modules/], // Ensure CommonJS modules are processed
      transformMixedEsModules: true, // Handle mixed ES/CommonJS modules
    },
  },
  plugins: [react(), tsconfigPaths(), wasm(), topLevelAwait(), viteCommonjs(), nodePolyfills()],
  resolve: {
    alias: {
      '@/app': '/app',
      '@/components': '/components',
      '@/lib': '/lib',
      '@/hooks': '/hooks',
      '@/providers': '/providers',
      '@/utils': '/utils',
      '@/types': '/types',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'node20',
      platform: 'node',
    },
    exclude: [
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/onchain-runtime',
      '@midnight-ntwrk/midnight-js-indexer-public-data-provider', // Exclude to avoid WebSocket issues
    ], // Prevent optimization of problematic packages
  },
  worker: {
    plugins: () => [wasm(), topLevelAwait()], // Support WASM in workers
  }
});

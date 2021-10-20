import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    minify: false,
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true, // auto-opens browser
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@stripe/react-stripe-js',
      '@stripe/stripe-js',
      'axios',
      'react-toastify',
    ],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    outDir: 'dist',
  },
});

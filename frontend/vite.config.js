// vite.config.js
// Vite configuration for your frontend development server and build process.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend dev server port
  },
});
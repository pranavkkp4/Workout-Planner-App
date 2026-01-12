import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the workout planner application.
// The base option ensures the build works when deployed from a subfolder (e.g. GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
});
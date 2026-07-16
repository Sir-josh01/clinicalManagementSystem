import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Keeps your Tailwind CSS plugin intact

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from the current system process environment (Vercel)
  // The third parameter '' loads ALL variables, including those from Vercel's platform
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(), 
    ],
    define: {
      // Bakes the live URL directly into your built React code
      // We read directly from Vite's `env` helper, bypassing `process.env` completely!
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  };
});
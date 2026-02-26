import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

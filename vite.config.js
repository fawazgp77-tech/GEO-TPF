import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: { port: 5173, strictPort: true, proxy: {
    '/api': 'http://127.0.0.1:3001',
    '/scan-api': { target: 'http://127.0.0.1:3002', rewrite: path => path.replace(/^\/scan-api/, '') },
  } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})

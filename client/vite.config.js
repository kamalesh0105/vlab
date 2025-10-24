import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: true,
    allowedHosts: ['xemplar.live'],
    proxy: {
      // Forward frontend dev requests to the backend server when running locally
      '/workspace': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  }
})

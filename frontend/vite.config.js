import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind plugin removed — project uses pure custom CSS, no utility classes
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
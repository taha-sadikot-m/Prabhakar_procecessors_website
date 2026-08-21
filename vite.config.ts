import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep public/ for dev; do not copy multi-MB assets into dist/ on build.
  // Production Express serves public/ then slim dist/.
  build: {
    copyPublicDir: false,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})

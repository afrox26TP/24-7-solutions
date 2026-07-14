import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Podrobnosti k nastaveni: https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Ve vyvoji se API pozadavky preposilaji na lokalni Express server.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})

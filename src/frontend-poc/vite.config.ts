import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../main/resources/static',
    emptyOutDir: true,
  },
  server: {
    https: {
      key: '../main/resources/ssl/192.168.0.110-key.pem',
      cert: '../main/resources/ssl/192.168.0.110.pem',
    },
    host: '192.168.0.110',
    port: 5173,
  },
})

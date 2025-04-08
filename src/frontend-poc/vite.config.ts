import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'C:/Users/Admin/OneDrive/Skrivbord/Studier/Spring/TeluskoSpringSecurityTutorial/src/main/resources/static',
    emptyOutDir: true,
  },
})

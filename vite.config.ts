import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',                // говорим Vite, что точка входа — папка src
  base: '/',                  // базовый URL
  plugins: [react()],
  build: {
    outDir: '../dist/client', // собирать в dist/client
    emptyOutDir: true,        // очищать папку перед сборкой
  },
  server: {
    port: 5173,
    host: true                // чтобы был доступ по сети (92.113.144.178)
  }
})

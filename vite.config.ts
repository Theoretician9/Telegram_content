import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',                // исходная папка с index.html и main.tsx
  base: '/',                  // базовый URL
  plugins: [react()],
  build: {
    outDir: '../dist/client', // куда положить собранный фронтенд
    emptyOutDir: true,        // очищать папку перед сборкой
  },
})

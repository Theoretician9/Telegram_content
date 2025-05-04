import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // плагин React
  plugins: [react()],
  // алиасы для удобного импорта
  resolve: {
    alias: {
      // чтобы ~/client/api резолвилось в src/client/api.ts и т.п.
      '~': path.resolve(__dirname, 'src'),
      // явно указываем на React
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  // сборка клиентской части
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html'),
    },
  },
})

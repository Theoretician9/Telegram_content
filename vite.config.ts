import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Указываем, что точка входа — директория с клиентскими файлами
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  resolve: {
    alias: {
      // Позволяет импортировать модули через "~/..." начиная из src
      '~': resolve(__dirname, 'src'),
      // Явные алиасы для React
      react: resolve(__dirname, 'node_modules', 'react'),
      'react-dom': resolve(__dirname, 'node_modules', 'react-dom')
    },
  },
  build: {
    // Выходная папка для собранного фронтенда
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  }
})

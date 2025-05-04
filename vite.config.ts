import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // указываем, что точка входа — папка src
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  resolve: {
    alias: [
      // без этого Vite не найдёт jsx-runtime в React 18
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime.js')
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime.js')
      }
    ]
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react'
    ]
  },
  build: {
    // сборка в dist/client
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // файл входа
      input: resolve(__dirname, 'src', 'index.html')
    }
  }
})

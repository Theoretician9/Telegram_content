import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  resolve: {
    alias: {
      // Основные алиасы
      '@': resolve(__dirname, 'src'),
      react: resolve(__dirname, 'node_modules', 'react'),
      'react-dom': resolve(__dirname, 'node_modules', 'react-dom'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html'),
      // Если нужно выставить внешние зависимости, добавь сюда:
      // external: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'lucide-react']
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
    ],
  },
})

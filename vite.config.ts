import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Папка с клиентским кодом и index.html
  root: resolve(__dirname, 'src'),

  plugins: [
    react(), // поддержка JSX
  ],

  resolve: {
    alias: {
      // чтобы можно было импортировать из ~/...
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),

      // явные пути к React, чтобы Vite не ругался
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
    },
  },

  optimizeDeps: {
    // заранее включаем основные пакеты для ускорения старта
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

  build: {
    // выводим собранный клиент в dist/client
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // точка входа
      input: resolve(__dirname, 'src', 'index.html'),
    },
  },
})

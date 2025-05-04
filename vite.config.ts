import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html'),
    },
  },
  resolve: {
    alias: [
      // поддержка импорта по ~/…
      { find: /^~\//, replacement: `${resolve(__dirname)}/` },
      // основные пакеты
      { find: 'react', replacement: resolve(__dirname, 'node_modules', 'react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules', 'react-dom') },
      // явное указание JSX runtime-файлов
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime.js'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime.js'),
      },
    ],
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

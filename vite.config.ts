import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),       // корневая папка фронтенда
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist/client'),  // куда складывать сборку
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html'),
    },
  },
  resolve: {
    alias: {
      // путь к React 18 JSX runtime
      'react/jsx-runtime': resolve(
        __dirname,
        'node_modules',
        'react',
        'jsx-runtime.js'
      ),
      'react/jsx-dev-runtime': resolve(
        __dirname,
        'node_modules',
        'react',
        'jsx-dev-runtime.js'
      ),
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
      'lucide-react'
    ]
  }
})

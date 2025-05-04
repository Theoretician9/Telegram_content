// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Корневая папка, где лежит index.html
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  resolve: {
    alias: {
      // '~' будет указывать в папку src
      '~': resolve(__dirname, 'src'),
      // если в коде используются абсолютные импорты из корня проекта, например:
      // import { foo } from '/client/utils'
      // то можно их тоже алиасить:
      '/client': resolve(__dirname, 'src', 'client'),
    }
  },
  build: {
    // В какую папку собирать
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    // Точка входа (относительно project root, а не workDir)
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html'),
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

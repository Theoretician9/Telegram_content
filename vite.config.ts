import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // указываем папку с index.html
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  resolve: {
    alias: [
      // чтобы Vite находил React и React-DOM
      { find: 'react', replacement: resolve(__dirname, 'node_modules', 'react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules', 'react-dom') },
      // для JSX runtime в React 18
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime.js'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime.js'),
      },
      // если в коде используете '~/...' — пробрасываем в корень проекта
      { find: '~/client', replacement: resolve(__dirname, 'src', 'client') },
      { find: '~/components', replacement: resolve(__dirname, 'src', 'components') },
      // добавьте сюда другие абсолютные алиасы по необходимости
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
  build: {
    // куда класть собранные файлы
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // точка входа
      input: resolve(__dirname, 'src', 'index.html'),
    },
  },
})

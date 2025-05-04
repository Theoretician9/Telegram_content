import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Папка исходников с index.html
  root: resolve(__dirname, 'src'),

  plugins: [
    react(),
  ],

  build: {
    // Вывод в dist/client
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', 'index.html'),
    },
  },

  resolve: {
    alias: {
      // Основные React-модули
      react: resolve(__dirname, 'node_modules', 'react'),
      'react-dom': resolve(__dirname, 'node_modules', 'react-dom'),

      // Явный алиас для JSX runtime
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

      // Алиас для ваших клиентских утилит
      '~/client': resolve(__dirname, 'src', 'client'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },
})

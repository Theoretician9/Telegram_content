import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),          // исходники в src/
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  resolve: {
    alias: [
      // Основной React
      { find: 'react', replacement: resolve(__dirname, 'node_modules/react/index.js') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules/react-dom/index.js') },

      // JSX runtime (React 18+)
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      },

      // Алиас для импорта из client/
      {
        find: '~/client',
        replacement: resolve(__dirname, 'src/client'),
      },
    ],
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

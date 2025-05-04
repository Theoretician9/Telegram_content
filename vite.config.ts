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
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
      },
    },
  },
  resolve: {
  alias: {
    react: resolve(__dirname, 'node_modules', 'react'),
    'react-dom': resolve(__dirname, 'node_modules', 'react-dom'),
    'react/jsx-runtime': resolve(__dirname, 'node_modules', 'react', 'jsx-runtime.js'),
    'react/jsx-dev-runtime': resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime.js'),
    '~/client': resolve(__dirname, 'src', 'client'),
  },
},
      // ваш ~/client/api
      {
        find: /^~\/client\/(.*)$/,
        replacement: resolve(__dirname, 'src', 'client', '$1'),
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

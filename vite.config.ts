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
    alias: [
      { find: 'react', replacement: resolve(__dirname, 'node_modules', 'react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules', 'react-dom') },
      { 
        find: /^react\/jsx-runtime$/, 
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime.js') 
      },
      { 
        find: /^react\/jsx-dev-runtime$/, 
        replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime.js') 
      },
      { 
        find: /^~client\/(.*)$/, 
        replacement: resolve(__dirname, 'src', '$1') 
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

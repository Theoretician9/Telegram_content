import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
      },
    },
  },
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react/jsx-dev-runtime']
  },
  plugins: [react()],
  resolve: {
    alias: {
      // чтобы Vite корректно находил JSX-runtime в React 18
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
})

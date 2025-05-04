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
    alias: {
      // основное:
      react: resolve(__dirname, 'node_modules', 'react'),
      'react-dom': resolve(__dirname, 'node_modules', 'react-dom'),
      // JSX-рантаймы:
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

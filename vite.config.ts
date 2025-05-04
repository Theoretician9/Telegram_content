import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // корень для dev-server и сборки — папка src
  root: resolve(__dirname, 'src'),
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
      // основной React
      { find: 'react', replacement: resolve(__dirname, 'node_modules/react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules/react-dom') },
      // нужные нам JSX-runtime
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      },
      // алиас для `~/client/...`
      {
        find: '~/client',
        replacement: resolve(__dirname, 'src/client'),
      },
    ],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
})

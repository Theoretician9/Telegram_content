import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Точка входа — папка с index.html
  root: resolve(__dirname, 'src'),
  base: '/',
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: [
      // чтобы ~/client/api резолвился в src/client/api
      { find: '~', replacement: resolve(__dirname, 'src') },
      // будем подставлять React из node_modules
      { find: 'react', replacement: resolve(__dirname, 'node_modules/react') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules/react-dom') },
      // и jsx-runtime из файлов с .js-расширением
      {
        find: 'react/jsx-runtime',
        replacement: resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: resolve(
          __dirname,
          'node_modules/react/jsx-dev-runtime.js'
        ),
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
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
    },
  },
})

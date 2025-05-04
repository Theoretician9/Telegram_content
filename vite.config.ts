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
    alias: [
      // сам React и ReactDOM
      { find: 'react', replacement: resolve(__dirname, 'node_modules', 'react') },
      {
        find: 'react-dom',
        replacement: resolve(__dirname, 'node_modules', 'react-dom'),
      },
      // явный алиас для JSX-runtime (без ^ и $ не сработает на ✕без.Extension)
      {
        find: /^react\/jsx-runtime$/,
        replacement: resolve(
          __dirname,
          'node_modules',
          'react',
          'jsx-runtime.js'
        ),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: resolve(
          __dirname,
          'node_modules',
          'react',
          'jsx-dev-runtime.js'
        ),
      },
    ],
  },
})

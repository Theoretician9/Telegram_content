import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // теперь корневой каталог — src
  root: resolve(__dirname, 'src'),
  plugins: [react()],
  build: {
    // итоговая сборка пойдёт в dist/client
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // входной HTML остаётся src/index.html
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  resolve: {
    alias: [
      // ~/client → src/client
      { find: '~/client', replacement: resolve(__dirname, 'src/client') },
    ],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
})

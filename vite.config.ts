import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // точка входа — корень репозитория
  root: '.',
  plugins: [react()],
  build: {
    // куда складывать собранный клиент
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // входная html
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  resolve: {
    alias: [
      // чтобы ~/client/* резолвилось в src/client/*
      { find: '~/client', replacement: resolve(__dirname, 'src/client') },
    ],
  },
  optimizeDeps: {
    // подтянем react в зависимостях на этапе dev
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
})

// vite.config.ts
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
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  resolve: {
    alias: [
      // чтобы в коде можно было писать import Foo from '~/components/Foo'
      { find: '~', replacement: resolve(__dirname, 'src') },
    ],
  },
  // для dev-серверa
  server: {
    port: 5173,
    host: true, // чтобы по внешнему IP тоже было доступно
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Папка, где лежит index.html и исходники клиента
  root: path.resolve(__dirname, 'src'),

  plugins: [
    // Классический JSX-runtime, чтобы не дергать react/jsx-runtime вручную
    react({
      jsxRuntime: 'classic'
    })
  ],

  resolve: {
    alias: {
      // import Foo from '~/components/Foo' будет резолвиться в src/components/Foo
      '~': path.resolve(__dirname, 'src')
    }
  },

  build: {
    // Сборка уедет в dist/client
    outDir: path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // Точка входа — ваш индексник
      input: path.resolve(__dirname, 'src/index.html')
    }
  }
})

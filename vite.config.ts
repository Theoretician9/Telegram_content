import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // исходная папка с index.html и исходниками React
  root: path.resolve(__dirname, 'src'),
  plugins: [
    // переключаемся на «classic» JSX-runtime,
    // чтобы не дергать react/jsx-runtime вручную
    react({
      jsxRuntime: 'classic'
    })
  ],
  resolve: {
    alias: {
      // чтобы в коде можно было писать import Foo from '~/components/Foo'
      '~': path.resolve(__dirname, 'src'),
      // и чтобы React разрешался однозначно из node_modules
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
  },
  build: {
    // куда складываем собранный клиент
    outDir: path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    rollupOptions: {
      // точка входа сборки
      input: path.resolve(__dirname, 'src/index.html')
    }
  }
})

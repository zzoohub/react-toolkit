import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@theme': path.resolve(__dirname, './@theme/src'),
      '@i18n': path.resolve(__dirname, './@i18n/src'),
    },
  },
})

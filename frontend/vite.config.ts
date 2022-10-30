/// <reference types="vitest" />

import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      runtime: path.resolve(__dirname, './wailsjs/runtime'),
      backend: path.resolve(__dirname, './wailsjs/go')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})

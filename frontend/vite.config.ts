/// <reference types="vitest" />

import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import monaco from 'vite-plugin-monaco-editor'

// 包的默认导出有问题，不可直接使用
const monacoEditorPlugin: typeof monaco = (monaco as any).default

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), monacoEditorPlugin({})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      runtime: path.resolve(__dirname, './wailsjs/runtime'),
      backend: path.resolve(__dirname, './wailsjs/go')
    }
  }
})

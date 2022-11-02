import { codeLocalStorage } from '@/utils/storage'
import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', {
  state: () => ({
    isWindowActive: true,
    editorTheme: ''
  }),
  actions: {
    changeTheme(theme: string) {
      const html = document.querySelector('html')
      if (html) {
        html.classList.add(theme)
      }
      codeLocalStorage.set('editor-theme', theme)
    }
  }
})

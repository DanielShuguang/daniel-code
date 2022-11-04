import { defineStore } from 'pinia'

export const useEditorConfigStore = defineStore('editor-config', {
  state: () => ({
    autoSave: false,
    theme: ''
  })
})

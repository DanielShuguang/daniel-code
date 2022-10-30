import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', {
  state: () => ({
    isWindowActive: true
  })
})

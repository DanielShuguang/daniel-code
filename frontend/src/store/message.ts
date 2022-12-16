import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messageCount: 0
  })
})

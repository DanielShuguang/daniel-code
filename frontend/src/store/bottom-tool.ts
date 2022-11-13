import { BottomTool } from '@/types/bottom-tool'
import { defineStore } from 'pinia'

export const useBottomToolStore = defineStore('bottom-tool', {
  state: () => ({
    toolList: <BottomTool[]>[]
  })
})

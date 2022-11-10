import { Nullable } from '@/types/common'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { defineStore } from 'pinia'

export const useProjectSystemStore = defineStore('project-system', {
  state: () => ({
    currentProject: <Nullable<FileTreeNode>>null
  })
})

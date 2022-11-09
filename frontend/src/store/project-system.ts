import { Nullable } from '@/types/common'
import { ProjectInfo } from '@/types/project-system'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const useProjectSystemStore = defineStore('project-system', {
  state: () => ({
    currentProject: <Nullable<FileTreeNode>>null
  }),
  actions: {
    changeCurrentProject(project: FileTreeNode) {
      this.currentProject = cloneDeep(project)
    }
  }
})

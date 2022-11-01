import { Nullable } from '@/types/common'
import { ProjectInfo } from '@/types/project-system'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const useProjectSystemStore = defineStore('project-system', {
  state: () => ({
    currentProject: <Nullable<ProjectInfo>>null
  }),
  actions: {
    changeCurrentProject(project: ProjectInfo) {
      this.currentProject = cloneDeep(project)
    }
  }
})

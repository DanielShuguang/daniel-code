import { Nullable } from '@/types/common'
import { ProjectInfo } from '@/types/project-system'
import { defineStore } from 'pinia'

export const useProjectSystemStore = defineStore('project-system', {
  state: () => ({
    currentProject: <Nullable<ProjectInfo>>null
  })
})

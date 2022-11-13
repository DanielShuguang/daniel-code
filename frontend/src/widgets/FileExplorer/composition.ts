import { useFileSystemStore, useProjectSystemStore } from '@/store'
import { FileInfo } from '@/types/file-system'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { logger } from '@/utils/logger'
import { isFileInfo } from '@/utils/type-check'
import { ReadDirTree, ReadFileContent } from 'backend/core/App'
import { cloneDeep, debounce } from 'lodash-es'
import { EventsOff, EventsOn } from 'runtime'
import { onUnmounted } from 'vue'
import { FolderWatchInfo } from './types'

const eventName = 'backend:folder-update'

export const useFolderWatcher = () => {
  const projectStore = useProjectSystemStore()
  const fileStore = useFileSystemStore()

  EventsOn(eventName, (info: FolderWatchInfo) => {
    const currentProject = cloneDeep(projectStore.$state.currentProject)
    if (!currentProject?.children?.length) return

    const projectPath = currentProject.path
    if (['create', 'delete', 'rename'].includes(info.content)) {
      handleUpdateProject(projectPath)
      if (info.content === 'rename') {
        updateEditor(info)
      }
    }
  })

  const updateEditor = debounce(async (info: FolderWatchInfo) => {
    const target = fileStore.$state.openEditors.find(
      el => isFileInfo(el.file) && el.key === info.origin
    )
    if (target) {
      const file = target.file as FileInfo
      const res = await ReadFileContent(file.path)
      file.path = info.new
      file.name = info.new.split(/(\\|\/)/).pop() ?? ''
      file.type = file.name.split('.').pop() ?? 'None'
      if (res.content) {
        file.content = [res.content]
      }
      if (fileStore.$state.currentEditor?.key === file.path) {
        fileStore.changeCurrentEditor(
          {
            component: '',
            key: file.path,
            type: 'file',
            name: file.name,
            viewMode: fileStore.$state.currentEditor.viewMode,
            file: file
          },
          fileStore.$state.currentEditor.viewMode
        )
      }
    }
  }, 500)

  const handleUpdateProject = debounce(async (prjPath: string) => {
    const result = await ReadDirTree(prjPath)
    if (!result.message && result.data) {
      overwriteProject(
        result.data.children || [],
        projectStore.$state.currentProject?.children || []
      )
      projectStore.$state.currentProject = result.data
    } else {
      logger.warn(result.message ?? '')
    }
  }, 500)

  const overwriteProject = (newPro: FileTreeNode[], oldPro: FileTreeNode[]) => {
    if (!newPro?.length) return

    newPro?.forEach((newEl, index) => {
      const oldEl = oldPro?.[index]
      if (newEl.isDir) {
        newEl.isExpanded = oldEl.isExpanded
      }
      if (newEl.children?.length && oldEl?.children?.length) {
        overwriteProject(newEl.children, oldEl.children)
      }
    })
  }

  onUnmounted(() => {
    EventsOff(eventName)
  })
}

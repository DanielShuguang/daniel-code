import { commandSerivce } from '@/commands'
import { useFileSystemStore, useProjectSystemStore } from '@/store'
import { FileInfo } from '@/types/file-system'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { logger } from '@/utils/logger'
import { isFileInfo } from '@/utils/type-check'
import { ReadDirTree, ReadFileContent } from 'backend/core/App'
import { cloneDeep, debounce } from 'lodash-es'
import { EventsOff, EventsOn } from 'runtime'
import { FolderWatchInfo } from './types'

const eventName = 'backend:folder-update'

export const useFolderWatcher = () => {
  const projectStore = useProjectSystemStore()
  const fileStore = useFileSystemStore()

  EventsOn(eventName, async (info: FolderWatchInfo) => {
    const currentProject = cloneDeep(projectStore.$state.currentProject)
    if (!currentProject?.children?.length) return

    const projectPath = currentProject.path
    if (['create', 'delete', 'rename'].includes(info.content)) {
      handleUpdateProject(projectPath)
      if (info.content === 'rename') {
        updateEditor(info)
      }
    } else if (info.content === 'write') {
      const target = fileStore.$state.openEditors.find(el => el.file?.path === info.origin)
      if (target) {
        const res = await ReadFileContent(info.origin)
        res.content && commandSerivce.execCommand('file-updated', target.key, res.content)
      }
    }
  })

  const updateEditor = debounce(async (info: FolderWatchInfo) => {
    const index = fileStore.$state.openEditors.findIndex(
      el => isFileInfo(el.file) && el.key === info.origin
    )
    if (index > -1) {
      const originActiveKey = fileStore.$state.currentEditor?.key
      const target = cloneDeep(fileStore.$state.openEditors[index])
      await commandSerivce.execCommand('file-close-editor-tab', target.key)
      const file = target.file as FileInfo
      target.key = info.new
      target.name = info.new.split(/(\\|\/)/).pop() ?? ''
      fileStore.$state.openEditors.splice(index, 0, target)
      file.path = info.new
      file.name = target.name
      file.type = file.name.split('.').pop() ?? 'None'
      if (originActiveKey === info.origin) {
        const res = await ReadFileContent(file.path)
        if (res.content) {
          file.content = [res.content]
        }
        fileStore.changeCurrentEditor(target, target.viewMode)
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

import { commandSerivce } from '@/commands'
import { useFileSystemStore, useProjectSystemStore } from '@/store'
import { FileInfo } from '@/types/file-system'
import { logger } from '@/utils/logger'
import { isFileInfo } from '@/utils/type-check'
import { OpenFileByDialog, OpenFolderByDialog } from 'backend/core/App'

/** 批量注册顶部菜单的命令 */
export const menuCommands = () => {
  commandSerivce.registerCommand('topmenu-open-file', async () => {
    const fileStore = useFileSystemStore()
    const result = await OpenFileByDialog()
    const existFile = fileStore.openEditors.find(
      editor => isFileInfo(editor) && editor.path === result.path
    )
    if (!result.message && !existFile) {
      const file: FileInfo = {
        name: result.name,
        content: [result.content],
        isBinary: result.isBinary,
        isProject: false,
        key: result.path,
        path: result.path,
        type: result.type ?? 'txt'
      }
      fileStore.$patch(state => state.openEditors.push(file))
      fileStore.changeCurrentEditor(file)
    } else if (isFileInfo(existFile)) {
      fileStore.changeCurrentEditor(existFile)
    }
  })
  commandSerivce.registerCommand('topmenu-open-folder', async () => {
    const projectStore = useProjectSystemStore()
    projectStore.currentProject
    const result = await OpenFolderByDialog()
    if (!result.message && result.data && projectStore.currentProject?.path !== result.data.path) {
      console.log(result.data)
      projectStore.$patch({ currentProject: result.data })
    } else if (result.message) {
      logger.error(result.message)
    }
  })
}

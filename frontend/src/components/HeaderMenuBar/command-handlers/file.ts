import { commandSerivce } from '@/commands'
import { activeOpenedFile } from '@/ui-components/DanFileTree/composition'
import { useProjectSystemStore } from '@/store'
import { logger } from '@/utils/logger'
import { OpenFileByDialog, OpenFolderByDialog } from 'backend/core/App'

export const fileCommandHandlers = () => {
  commandSerivce.registerCommand('topmenu-open-file', async () => {
    const result = await OpenFileByDialog()
    if (!result.message) {
      activeOpenedFile(
        {
          ...result,
          content: [result.content],
          isProject: false,
          type: result.type ?? 'txt'
        },
        false
      )
    } else if (result.message && result.message !== 'cancel') {
      logger.error(result.message)
    }
  })
  commandSerivce.registerCommand('topmenu-open-folder', async () => {
    const projectStore = useProjectSystemStore()
    projectStore.currentProject
    const result = await OpenFolderByDialog()
    if (!result.message && result.data && projectStore.currentProject?.path !== result.data.path) {
      projectStore.$patch({ currentProject: result.data })
    } else if (result.message && result.message !== 'cancel') {
      logger.error(result.message)
    }
  })
  commandSerivce.registerCommand('topmenu-save', async () => {
    const fileResult = await commandSerivce.execCommand('file-read-current-content')
    if (!fileResult?.hasModified) {
    } else {
      console.log('get content', fileResult)
    }

    commandSerivce.execCommand('file-save-complete', fileResult?.filePath || '')
  })
}

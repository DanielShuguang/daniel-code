import { commandSerivce } from '@/commands'
import { activeOpenedFile } from '@/ui-components/DanFileTree/composition'
import { useFileSystemStore, useProjectSystemStore } from '@/store'
import { logger } from '@/utils/logger'
import { ModifyFileContent, OpenFileByDialog, OpenFolderByDialog } from 'backend/core/App'
import { isFileInfo } from '@/utils/type-check'
import { EventsEmit, Quit } from 'runtime'

export const fileCommandHandlers = () => {
  const projectStore = useProjectSystemStore()
  const fileStore = useFileSystemStore()

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
    const result = await OpenFolderByDialog()
    if (!result.message && result.data && projectStore.currentProject?.path !== result.data.path) {
      projectStore.$state.currentProject = result.data
      EventsEmit('backend:update-project-path', result.data.path)
    } else if (result.message && result.message !== 'cancel') {
      logger.error(result.message)
    }
  })
  commandSerivce.registerCommand('topmenu-save', async file => {
    // 获取当前编辑器的内容
    const fileResult = file ?? (await commandSerivce.execCommand('file-read-current-content'))
    // 如果为修改状态则保存的本地文件
    if (!fileResult || !fileResult?.hasModified) return

    const result = await ModifyFileContent(fileResult.filePath, fileResult.content)
    // 保存失败，弹出消息提示
    if (result.message) {
      logger.error(result.message)
    } else {
      commandSerivce.execCommand('file-save-complete', fileResult?.filePath || '')
    }
  })
  commandSerivce.registerCommand('topmenu-save-all', async () => {
    const opendMap = await commandSerivce.execCommand('file-get-opend-files')
    if (!opendMap) return

    opendMap.forEach((val, key) => {
      if (!val.modified.value) return
      const target = fileStore.openEditors.find(el => isFileInfo(el.file) && el.key === key)
      if (!target?.file) return

      commandSerivce.execCommand('topmenu-save', {
        content: target.file.content.join('') || '',
        filePath: target.file.path,
        hasModified: true
      })
    })
  })
  commandSerivce.registerCommand('topmenu-close-window', Quit)
  commandSerivce.registerCommand('topmenu-exit', Quit)
}

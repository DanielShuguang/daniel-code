import { commandSerivce } from '@/commands'
import { useFileSystemStore } from '@/store'
import { FileInfo } from '@/types/file-system'
import { isFileInfo } from '@/utils/type-check'
import { OpenFileByDialog } from 'backend/core/App'

export const menuCommands = () => {
  commandSerivce.registerCommand('topmenu-open-file', async () => {
    const fileStore = useFileSystemStore()
    const result = await OpenFileByDialog()
    const existFile = fileStore.openEditors.find(
      editor => isFileInfo(editor) && result.path === result.path
    )
    if (!result.err && !existFile) {
      const file: FileInfo = {
        name: result.name,
        content: [result.content],
        isBinary: result.isBinary,
        isProject: false,
        key: result.path,
        path: result.path,
        type: result.type ?? ''
      }
      fileStore.$patch(state => state.openEditors.push(file))
      fileStore.changeCurrentEditor(file)
    } else if (isFileInfo(existFile)) {
      fileStore.changeCurrentEditor(existFile)
    }
  })
}

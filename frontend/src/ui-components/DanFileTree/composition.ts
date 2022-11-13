import { useFileSystemStore } from '@/store'
import { FileInfo } from '@/types/file-system'
import { isFileInfo } from '@/utils/type-check'
import { ReadFileContent } from 'backend/core/App'
import { FileTreeNode } from './types'

export const handleOpenFile = async (fileNode: FileTreeNode, viewMode: boolean) => {
  const result = await ReadFileContent(fileNode.path)
  activeOpenedFile(
    {
      content: result.content ? [result.content] : [],
      isProject: true,
      type: fileNode.type,
      isBinary: result.isBinary,
      name: fileNode.name,
      path: fileNode.path
    },
    viewMode
  )
}

/**
 * 激活/打开文件
 * @param fileInfo
 */
export const activeOpenedFile = (fileInfo: FileInfo, viewMode: boolean) => {
  const fileStore = useFileSystemStore()
  const existFile = fileStore.openEditors.find(
    editor => isFileInfo(editor.file) && editor.key === fileInfo.path
  )
  const viewModeIndex = fileStore.openEditors.findIndex(el => el.viewMode)
  // 判断是否已被打开，是则直接激活，否则插入新文件内容页
  if (!existFile) {
    const obj = {
      key: fileInfo.path,
      name: fileInfo.name,
      type: 'file',
      file: fileInfo,
      component: '',
      viewMode
    } as const
    if (viewModeIndex > -1) {
      fileStore.$state.openEditors.splice(viewModeIndex, 1, obj)
    }
    fileStore.changeCurrentEditor(obj, viewMode)
  } else if (isFileInfo(existFile.file)) {
    fileStore.changeCurrentEditor(existFile, viewMode)
  }
}

import { Nullable } from '@/types/common'
import { FileInfo, GenericContainer } from '@/types/file-system'
import { codeLocalStorage } from '@/utils/storage'
import { isFileInfo } from '@/utils/type-check'
import { cloneDeep, omit } from 'lodash-es'
import { defineStore } from 'pinia'

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    currentEditor: <Nullable<Omit<FileInfo, 'content'> | GenericContainer>>null,
    openEditors: <Array<FileInfo | GenericContainer>>[]
  }),
  actions: {
    changeCurrentEditor(file: FileInfo | GenericContainer) {
      this.currentEditor = cloneDeep(file)
      codeLocalStorage.set('active-editor', file)
    },
    changeOpenEditors(...files: Array<FileInfo | GenericContainer>) {
      this.openEditors.push(...cloneDeep(files))
      codeLocalStorage.set(
        'opened-editors',
        this.openEditors.map(e => (isFileInfo(e) ? { ...e, content: [] } : e))
      )
    }
  }
})

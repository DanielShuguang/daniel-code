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
    changeCurrentEditor(editor: Nullable<Omit<FileInfo, 'content'> | GenericContainer>) {
      const result = cloneDeep(
        isFileInfo(editor) && editor.content ? omit(editor, ['content']) : editor
      )
      this.currentEditor = result
      codeLocalStorage.set('active-editor', result)
    }
  }
})

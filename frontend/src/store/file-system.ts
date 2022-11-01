import { Nullable } from '@/types/common'
import { FileInfo } from '@/types/file-system'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    currentFile: <Nullable<FileInfo>>null,
    openFiles: <FileInfo[]>[]
  }),
  actions: {
    changeCurrentFile(file: FileInfo) {
      this.currentFile = cloneDeep(file)
    },
    changeOpenFiles(...files: FileInfo[]) {
      this.openFiles.push(...cloneDeep(files))
    }
  }
})

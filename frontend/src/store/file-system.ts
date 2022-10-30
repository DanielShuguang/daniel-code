import { Nullable } from '@/types/common'
import { FileInfo } from '@/types/file-system'
import { defineStore } from 'pinia'

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    currentFile: <Nullable<FileInfo>>null
  })
})

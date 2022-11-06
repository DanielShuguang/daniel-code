import { Nullable } from '@/types/common'
import { EditorDetails } from '@/types/file-system'
import { codeLocalStorage } from '@/utils/storage'
import { cloneDeep, omit } from 'lodash-es'
import { defineStore } from 'pinia'

export const useFileSystemStore = defineStore('file-system', {
  state: () => ({
    currentEditor: <Nullable<EditorDetails>>null,
    openEditors: <EditorDetails[]>[]
  }),
  actions: {
    changeCurrentEditor(editor: Nullable<EditorDetails>, viewMode: boolean) {
      const newEditor = cloneDeep(editor)
      if (newEditor) {
        newEditor.viewMode = viewMode
      }
      this.currentEditor = newEditor
      const target = this.openEditors.find(el => el.key === editor?.key)
      if (target && target.viewMode) {
        target.viewMode = viewMode
      } else if (!target && newEditor) {
        this.openEditors.push(newEditor)
      }
      codeLocalStorage.set('active-editor', this.currentEditor)
    }
  }
})

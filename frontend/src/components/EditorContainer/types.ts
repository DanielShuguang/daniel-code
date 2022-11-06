import { editor } from 'monaco-editor'
import { Ref } from 'vue'

export interface FileEditorOptions {
  modified: Ref<boolean>
  instance: editor.IStandaloneCodeEditor
}

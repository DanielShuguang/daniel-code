import { editor } from 'monaco-editor'

export interface FileEditorOptions {
  modified: Ref<boolean>
  instance: editor.IStandaloneCodeEditor
}

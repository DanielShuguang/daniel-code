import { FileEditorOptions } from '@/components/EditorContainer/types'
import { Nullable } from '@/types/common'
import { CurrentFileBase } from '@/types/file-system'

export interface FileCommands {
  'file-get-opend-files': () => Map<string, FileEditorOptions>
  'file-read-current-content': () => Nullable<CurrentFileBase>
  'file-save-complete': (tabKey: string) => void
}

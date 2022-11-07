export interface FileCommands {
  'file-read-current-content': () => { content: string; hasModified: boolean; filePath: string }
  'file-save-complete': (tabKey: string) => void
}

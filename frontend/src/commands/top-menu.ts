export type TopMenuCommands = FileMenuCommands & EditMenuCommands

export interface FileMenuCommands {
  'topmenu-add-text-file': () => void
  'topmenu-add-file': () => void
  'topmenu-add-window': () => void

  'topmenu-open-file': () => void
  'topmenu-open-folder': () => void
  'topmenu-open-recent-file': () => void

  'topmenu-save': () => void
  'topmenu-save-as': () => void
  'topmenu-save-all': () => void

  'topmenu-auto-save': () => void
  'topmenu-preferences': () => void

  'topmenu-restore-files': () => void
  'topmenu-close-editor': () => void
  'topmenu-close-folder': () => void
  'topmenu-close-window': () => void
  'topmenu-exit': () => void
}

export interface EditMenuCommands {
  'topmenu-revoke': () => void
  'topmenu-recovery': () => void

  'topmenu-shear-cut': () => void
  'topmenu-copy': () => void
  'topmenu-paste': () => void

  'topmenu-search': () => void
  'topmenu-replace': () => void

  'topmenu-search-in-file': () => void
  'topmenu-replace-in-file': () => void

  'topmenu-comment-line': () => void
  'topmenu-comment-block': () => void
  'topmenu-emmet': () => void
}

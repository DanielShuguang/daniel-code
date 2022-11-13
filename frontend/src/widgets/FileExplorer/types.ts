export interface FolderWatchInfo {
  content: FolderWatchType
  origin: string
  new: string
}

export type FolderWatchType =
  | 'create'
  | 'write'
  | 'delete'
  | 'rename'
  | 'chmod'
  | `error: ${string}`

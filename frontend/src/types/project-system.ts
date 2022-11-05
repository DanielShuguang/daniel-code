import { filesystem } from 'backend/models'

interface DirTree extends Omit<filesystem.DirTree, 'convertValues' | 'children'> {
  children?: DirTree[]
}

export type ProjectInfo = DirTree

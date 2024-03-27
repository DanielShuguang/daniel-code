import { FileTreeNode } from './types'

export const clickNodeFnKey: InjectionKey<(node: FileTreeNode) => void> = Symbol('click-node-fn')
export const doubleClickFileFnKey: InjectionKey<(node: FileTreeNode) => void> =
  Symbol('double-click-file')

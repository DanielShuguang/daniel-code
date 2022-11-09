import { Nullable } from '@/types/common'

interface TreeNode {
  [key: string]: any[]
}

const isTreeNode = (node: any, key: string): node is TreeNode => {
  return key in node
}

export const depthFirstSearch = <T extends Record<string, any>>(
  tree: T[],
  condition: (node: T) => boolean,
  key = 'children'
): Nullable<T> => {
  if (!tree.length) {
    return undefined
  }

  for (const node of tree) {
    if (isTreeNode(node, key) && node[key].length) {
      const result = depthFirstSearch(node[key], condition, key)
      if (result) {
        return result
      }
    }
    if (condition(node)) {
      return node
    }
  }
}

export const breadthFirstSearch = <T extends Record<string, any>>(
  tree: T[],
  condition: (node: T) => boolean,
  key = 'children'
): Nullable<T> => {
  if (!tree.length) {
    return undefined
  }

  for (const node of tree) {
    if (condition(node)) {
      return node
    }
    if (isTreeNode(node, key)) {
      const result = breadthFirstSearch(node[key], condition, key)
      if (result) {
        return result
      }
    }
  }
}

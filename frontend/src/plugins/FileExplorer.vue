<script lang="ts" setup>
import DanFileTree from '@/ui-components/DanFileTree/index.vue'
import { useProjectSystemStore } from '@/store'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { breadthFirstSearch } from '@/utils/tree-search'
import { ReadDirTree } from 'backend/core/App'
import { commandSerivce } from '@/commands'

const projectStore = useProjectSystemStore()

const handleFolderExpand = async (node: FileTreeNode) => {
  const willExpand = !node.isExpanded
  let children = node.children
  if (willExpand) {
    children = await loadFolderDetails(node)
  }
  projectStore.$patch(state => {
    if (!state.currentProject?.children?.length) {
      return
    }
    const target = breadthFirstSearch(
      state.currentProject.children,
      item => item.isDir && item.path === node.path
    )
    if (target) {
      target.isExpanded = willExpand
      if (willExpand && target.hasChildren) {
        target.children = children
      }
    }
  })
}

const loadFolderDetails = async (folder: FileTreeNode) => {
  const result = await ReadDirTree(folder.path)
  if (!result.message && result.data) {
    return result.data.children
  } else {
    commandSerivce.execCommand('dan-code-message', {
      type: 'error',
      message: result.message || '读取文件夹错误'
    })
  }
}
</script>

<script lang="ts">
export default {
  name: 'file-explorer'
}
</script>

<template>
  <DanFileTree
    v-if="projectStore.currentProject"
    :root-folder="projectStore.currentProject"
    @click-folder="handleFolderExpand"
  />
</template>

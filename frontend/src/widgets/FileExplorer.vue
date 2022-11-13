<script lang="ts" setup>
import DanFileTree from '@/ui-components/DanFileTree/DanFileTree.vue'
import { useProjectSystemStore } from '@/store'
import { FileTreeNode } from '@/ui-components/DanFileTree/types'
import { breadthFirstSearch } from '@/utils/tree-search'
import { ReadDirTree } from 'backend/core/App'
import { messageSerivce } from '@/components/MessageBox/composition'
import { useFolderWatcher } from './FileExplorer/composition'

const projectStore = useProjectSystemStore()
useFolderWatcher()

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
    messageSerivce({
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
  <div class="file-explorer">
    <h3 class="project-name title">{{ projectStore.currentProject?.name }}</h3>
    <DanFileTree
      v-if="projectStore.currentProject"
      class="file-tree"
      :root-folder="projectStore.currentProject"
      @click-folder="handleFolderExpand"
    />
  </div>
</template>

<style lang="scss" scoped>
.file-explorer {
  position: relative;
  max-height: calc(100vh - 52px);
  overflow: hidden auto;

  .project-name {
    min-width: 3rem;
    padding-left: 20px;
    line-height: 22px;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .title {
    text-transform: uppercase;
  }
}
</style>

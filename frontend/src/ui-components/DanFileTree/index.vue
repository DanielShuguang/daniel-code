<script lang="ts" setup>
import { provide } from 'vue'
import { handleOpenFile } from '../../ui-components/DanFileTree/composition'
import DanFileTreeNode from './DanFileTreeNode.vue'
import { clickNodeFnKey, doubleClickFileFnKey } from '../../ui-components/DanFileTree/data'
import { FileTreeNode } from '../../ui-components/DanFileTree/types'

defineProps<{
  rootFolder: FileTreeNode
}>()
const emit = defineEmits<{
  (event: 'update:rootFolder', data: FileTreeNode): void
  (event: 'clickNode', node: FileTreeNode): void
  (event: 'clickFile', node: FileTreeNode): void
  (event: 'clickFolder', node: FileTreeNode): void
  (event: 'doubleClickFile', node: FileTreeNode): void
}>()

let flag = false
const singleClick = (fn: () => void) => {
  flag = false
  setTimeout(() => {
    if (flag) {
      return
    }
    fn()
  }, 300)
}

provide(clickNodeFnKey, node => {
  emit('clickNode', node)
  if (node.isDir) {
    emit('clickFolder', node)
  } else {
    emit('clickFile', node)
    singleClick(() => handleOpenFile(node, true))
  }
})
provide(doubleClickFileFnKey, node => {
  flag = true
  emit('doubleClickFile', node)
  handleOpenFile(node, false)
})
</script>

<script lang="ts">
export default {
  name: 'dan-file-tree'
}
</script>

<template>
  <div class="dan-file-tree">
    <DanFileTreeNode v-for="item in rootFolder.children" :tree-node="item" />
  </div>
</template>

<style lang="scss" scoped>
.dan-file-tree {
  width: 100%;
}
</style>

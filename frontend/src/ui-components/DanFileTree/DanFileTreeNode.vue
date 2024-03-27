<script lang="ts" setup>
import { codicon } from '@/utils/codicon'
import { clickNodeFnKey, doubleClickFileFnKey } from './data'
import { FileTreeNode } from './types'

withDefaults(
  defineProps<{
    treeNode: FileTreeNode
    treeDeep?: number
  }>(),
  { treeDeep: 1 }
)

const handleClickNode = inject(clickNodeFnKey)
const handleDoubleClickNode = inject(doubleClickFileFnKey)
</script>

<script lang="ts">
export default {
  name: 'dan-file-tree-node'
}
</script>

<template>
  <div
    class="dan-file-tree-node"
    @click.stop="handleClickNode?.(treeNode)"
    @dblclick="!treeNode.isDir && handleDoubleClickNode?.(treeNode)"
  >
    <div class="file-node-content">
      <div class="indent" :style="{ paddingLeft: 8 * treeDeep + 'px' }">
        <div
          v-if="treeNode.isDir"
          :class="['expand-icon', codicon('chevron-down'), { 'is-expanded': treeNode.isExpanded }]"
        ></div>
      </div>
      <div
        :class="['file-icon', codicon(treeNode.isDir ? 'folder' : 'file')]"
        :title="treeNode.path"
      ></div>
      <div class="file-name" :title="treeNode.path">{{ treeNode.name }}</div>
    </div>
    <div
      class="file-tree-children"
      v-show="treeNode.isExpanded"
      v-if="treeNode.hasChildren && treeNode.children?.length"
    >
      <DanFileTreeNode
        v-for="item in treeNode.children"
        :tree-node="item"
        :tree-deep="treeDeep + 1"
      />
    </div>
  </div>
</template>

<style lang="scss">
.dan-file-tree-node {
  width: 100%;
  .file-node-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 22px;
    padding-left: 4px;
    font-size: 13px;
    color: var(--base-font-color);
    cursor: pointer;
    &:hover {
      background: var(--hover-file-node-background);
    }
  }
  .indent {
    width: 16px;
    height: 16px;
    padding-right: 6px;
  }
  .file-name {
    flex: 1;
    height: 22px;
    margin-right: 5px;
    line-height: 22px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .expand-icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
    transform: rotate(-90deg);

    &.is-expanded {
      transform: initial;
    }
  }
  .file-icon {
    width: 22px;
    height: 22px;
    line-height: 22px !important;
    padding-right: 6px;
  }
}
</style>

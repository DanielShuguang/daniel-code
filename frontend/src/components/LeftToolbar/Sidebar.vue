<script lang="ts" setup>
import { ref } from 'vue'
import DanContextmenu from '../DanContextmenu.vue'
import DanSplitLine from '../DanSplitLine.vue'

const defaultWidth = 300
const barWidth = ref(defaultWidth)

const handleSplitChange = (offset: number) => {
  barWidth.value += offset
}
</script>

<template>
  <DanContextmenu class="sidebar" :menus="[]">
    <div class="sidebar" :style="{ width: barWidth + 'px' }">
      <DanSplitLine
        :default-vector="{ x: 300, y: 0 }"
        @change="handleSplitChange"
        @reset-click="barWidth = defaultWidth"
      />
    </div>
  </DanContextmenu>
</template>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  height: 100%;
  background: var(--left-tool-background);
}
</style>

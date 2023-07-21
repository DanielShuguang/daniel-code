<script lang="ts" setup>
import { bottomTools } from './data'
import { computed } from 'vue'

const leftTools = computed(() => bottomTools.filter(el => el.position === 'left'))
const rightTools = computed(() => bottomTools.filter(el => el.position === 'right'))
</script>

<template>
  <footer class="bottom-toolbar">
    <div class="left-container">
      <component v-for="el in leftTools" :key="el.key" :is="el.component" />
    </div>
    <div class="right-container">
      <component v-for="el in rightTools" :key="el.key" :is="el.component" />
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.bottom-toolbar {
  display: flex;
  background: var(--bottom-toolbar-background);

  .left-container,
  .right-container {
    flex: 1;
    display: flex;
    align-items: center;

    :deep() .bottom-tool-item {
      cursor: pointer;

      &:hover {
        background-color: var(--bottom-tool-hover-background);
      }
    }
  }
  .left-container {
    justify-content: flex-start;
    > :first-child {
      margin-right: 7px;
    }
  }
  .right-container {
    justify-content: flex-end;
    > :last-child {
      margin-right: 7px;
    }
  }
}
</style>

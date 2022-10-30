<script lang="ts" setup>
import { plugins } from './data'
import { Plugin } from './types'

const getPluginTitle = (plugin: Plugin) => {
  const list = [plugin.title]
  if (plugin.shortcut) {
    list.push(`(${plugin.shortcut})`)
  }
  return list.join('')
}
</script>

<template>
  <div class="plugin-toolbar">
    <div class="content">
      <ul class="actions-container">
        <li class="action-item" v-for="p in plugins" :key="p.title" :title="getPluginTitle(p)">
          <a :class="['icon', p.icon]"></a>
          <div v-if="p.badge" class="badge">
            <div class="badge-content"></div>
          </div>
        </li>
      </ul>
      <div class="editor-action-bar"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 48px;
  height: 100%;
  background: var(--left-foreground);
}
.actions-container {
  width: 100%;
  overflow: hidden;
}
.action-item {
  position: relative;
  width: 100%;
  height: 48px;
  color: var(--default-plugin-color);
  cursor: pointer;
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 24px;
  }

  .badge {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    &-content {
      position: absolute;
      top: 24px;
      right: 8px;
      font-size: 9px;
      font-weight: 600;
      min-width: 8px;
      height: 16px;
      line-height: 16px;
      padding: 0 4px;
      border-radius: 20px;
      background: var(--bottom-toolbar-background);
      color: var(--active-plugin-color);
      text-align: center;
    }
  }

  &.active,
  &:hover {
    color: var(--active-plugin-color);
  }
}
.editor-action-bar {
  width: 100%;
}
</style>

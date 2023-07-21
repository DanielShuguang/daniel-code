<script lang="ts" setup>
import { usePluginStore } from '@/store'
import { plugins } from './data'
import { Plugin } from './types'
import DanSplitLine from '@/ui-components/DanSplitLine.vue'
import { ref } from 'vue'

const defaultWidth = 300
const barWidth = ref(defaultWidth)

const pluginStore = usePluginStore()

const getPluginTitle = (plugin: Plugin) => {
  const list = [plugin.title]
  if (plugin.shortcut) {
    list.push(`(${plugin.shortcut})`)
  }
  return list.join('')
}

const handleSplitChange = (offset: number) => {
  barWidth.value += offset
}

const handleClickPlugin = (plugin: Plugin) => {
  pluginStore.changeActivePlugin(plugin)
}

const getCurrentComponent = () => {
  const target = plugins.find(p => pluginStore.activePlugin?.pluginKey === p.pluginKey)
  return target?.component
}
</script>

<template>
  <div class="plugin-toolbar" data-code-plugin>
    <div class="content">
      <ul class="actions-container">
        <li
          v-for="p in plugins"
          :class="['action-item', { active: pluginStore.activePlugin?.pluginKey === p.pluginKey }]"
          :key="p.title"
          :title="getPluginTitle(p)"
          @click="handleClickPlugin(p)"
        >
          <a :class="['icon', p.icon]"></a>
          <div v-if="p.badge" class="badge">
            <div class="badge-content"></div>
          </div>
        </li>
      </ul>
      <div class="editor-action-bar"></div>
    </div>

    <div class="sidebar" :style="{ width: barWidth + 'px' }">
      <component :is="getCurrentComponent()" />
      <DanSplitLine
        :default-vector="{ x: defaultWidth - 4, y: 0 }"
        @change="handleSplitChange"
        @reset-click="barWidth = defaultWidth"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.plugin-toolbar {
  display: flex;
}
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
.sidebar {
  position: relative;
  height: 100%;
  background: var(--left-tool-background);
}
.plugin-content {
  height: 100%;
  width: 100%;
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
  &.active {
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      content: ' ';
      width: 2px;
      height: 48px;
      background: var(--active-plugin-color);
    }
  }
}
.editor-action-bar {
  width: 100%;
}
</style>

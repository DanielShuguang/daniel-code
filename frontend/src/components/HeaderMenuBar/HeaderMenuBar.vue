<script lang="ts" setup>
import { useBaseStore, useFileSystemStore, useProjectSystemStore } from '@/store'
import { Nullable } from '@/types/common'
import { cloneDeep } from 'lodash-es'
import DanMenuList, { DanMenuListProps } from '../../ui-components/DanMenuList.vue'
import {
  useMenusCommandsShortcuts,
  useMovingWindowTitle,
  useWindowControllers
} from './composition'
import { topMenus } from './data'
import { TopMenuButton } from './types'

const { titleDom, titleWidth } = useMovingWindowTitle()
const { correctControls, windowControl } = useWindowControllers()
useMenusCommandsShortcuts()

const defualtInfo = {
  list: [],
  position: { x: 0, y: 0 }
}
const isActive = ref(false)
const menuDom = ref<Nullable<HTMLDivElement>>(null)
const menuInfo = ref<Pick<DanMenuListProps, 'list' | 'position'>>(cloneDeep(defualtInfo))
const activeMenu = ref('')

const fileStore = useFileSystemStore()
const projectStore = useProjectSystemStore()
const baseStore = useBaseStore()
onClickOutside(menuDom, () => handleCloseMenu())

/** 打开下拉菜单 */
const handleClickMenu = (menu: TopMenuButton, ev: MouseEvent) => {
  isActive.value = true
  activeMenu.value = menu.title
  const target = ev.target as HTMLDivElement
  const rect = target.getBoundingClientRect()
  menuInfo.value = {
    list: menu.children,
    position: { x: rect.x, y: 30 }
  }
}

const handleCloseMenu = () => {
  isActive.value = false
  activeMenu.value = ''
  menuInfo.value = cloneDeep(defualtInfo)
}

const windowTitle = computed(() => {
  const titleList = ['Daniel Code']
  if (projectStore.currentProject) {
    titleList.unshift(projectStore.currentProject.name)
  }
  if (fileStore.currentEditor) {
    titleList.unshift(fileStore.currentEditor.name)
  }
  if (titleList.length === 1) {
    titleList.unshift('开始')
  }
  return titleList.join(' - ')
})
watchEffect(() => {
  if (!baseStore.isWindowActive) {
    handleCloseMenu()
  }
})
</script>

<template>
  <header class="top-header">
    <div v-windrag class="titlebar-drag-region" @dblclick="windowControl('max')"></div>
    <div class="titlebar-container">
      <div v-windrag class="window-appicon" @dblclick="windowControl('max')"></div>
      <div class="menubar" role="menubar" ref="menuDom">
        <div
          v-for="menu in topMenus"
          :key="menu.title"
          :class="['menubar-menu-button', { active: activeMenu === menu.title }]"
          role="menuitem"
          tabindex="-1"
          @click="handleClickMenu(menu, $event)"
          @mouseenter="isActive && handleClickMenu(menu, $event)"
        >
          <div class="menubar-menu-title">{{ menu.title }}({{ menu.shortcut }})</div>
        </div>
        <DanMenuList v-if="isActive" :="menuInfo" @close="handleCloseMenu" />
      </div>
      <div
        v-windrag
        class="window-title"
        ref="titleDom"
        :style="{ left: `calc(50% - ${titleWidth / 2}px)` }"
        @dblclick="windowControl('max')"
      >
        {{ windowTitle }}
      </div>
    </div>
    <div class="window-controls-container" v-windrag="false" v-uncontext>
      <div
        v-for="ctr of correctControls"
        :key="ctr.icon"
        :class="['window-icon', ctr.type, ctr.icon]"
        @click="windowControl(ctr.type)"
      ></div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-header {
  position: relative;
  display: flex;
  background: var(--top-menu-background);
}
.titlebar-drag-region {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.window-appicon {
  height: 100%;
  width: 35px;
  background-image: url('@/assets/images/svg/download.svg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 16px;
}
.window-title {
  position: absolute;
  color: var(--base-font-color);
  z-index: 2500;
  cursor: default;
}
.titlebar-container {
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 22px;
}
.menubar {
  display: flex;
  height: 100%;
  z-index: 2500;

  &-menu-button {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
  }

  &-menu-title {
    padding: 0 8px;
    border-radius: 5px;
    font-size: 13px;
    color: var(--base-font-color);
    line-height: 22px;
    cursor: default;
  }

  &-menu-button:hover &-menu-title,
  &-menu-button.active &-menu-title {
    background: var(--top-menu-hoverbackground);
  }
}
.window-controls-container {
  position: absolute;
  right: 0;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: center;
  z-index: 3000;
  height: 100%;
  width: 138px;
  color: var(--base-font-color);
  cursor: default;

  .window-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 46px;
    font-size: 16px;
    color: var(--base-font-color);

    &::before {
      height: 16px;
      line-height: 16px;
    }
    &:hover {
      background: var(--active-window-control-color);
      &.close {
        color: var(--active-item-font-color);
        background: var(--close-window-control-color);
      }
    }
  }
}
</style>

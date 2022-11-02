<script lang="ts" setup>
import { commandSerivce } from '@/commands'
import { Vector2D } from '@/types/common'
import { codicon } from '@/utils/codicon'
import { useEventListener } from '@vueuse/core'
import { cloneDeep, throttle } from 'lodash-es'
import { ref } from 'vue'
import { MenuListItem } from './HeaderMenuBar/types'

export interface DanMenuListProps {
  list: MenuListItem[]
  position: Vector2D
  zIndex?: number
  isChildMenu?: boolean
}

const props = withDefaults(defineProps<DanMenuListProps>(), {
  zIndex: 10,
  isChildMenu: false
})
const emit = defineEmits<{
  (event: 'close'): void
}>()

const defaultActive = {
  show: false,
  position: <Vector2D>{ x: 0, y: 0 }
}
const activeMenu = ref<MenuListItem[]>([])
const activeTarget = ref(cloneDeep(defaultActive))
const hoverItem = ref('')

useEventListener('keydown', ev => {
  if (ev.key === 'Escape') {
    emit('close')
  }
})

const handleHover = (menu: MenuListItem, ev: MouseEvent) => {
  hoverItem.value = menu.title
  handleActiveChildMenu(menu, ev)
}

const handleActiveChildMenu = throttle((menu: MenuListItem, ev: MouseEvent) => {
  if (!menu.children?.length) {
    activeTarget.value = cloneDeep(defaultActive)
    activeMenu.value.length = 0
    return
  }

  const target = ev.target as HTMLDivElement
  const rect = target.getBoundingClientRect()
  activeTarget.value = {
    show: true,
    position: { x: rect.x + 315, y: rect.y }
  }
  activeMenu.value = cloneDeep(menu.children)
}, 500)

const closeNextMenu = () => {
  activeTarget.value = cloneDeep(defaultActive)
  activeMenu.value.length = 0
  hoverItem.value = ''
}

const handleClickMenu = (menu: MenuListItem) => {
  if (!menu.command) {
    return
  }

  commandSerivce.execCommand(menu.command as any)
  emit('close')
}

const showSplitLine = (index: number) => {
  if (index === props.list.length - 1 || props.list[index].type === props.list[index + 1].type) {
    return false
  }
  return true
}
</script>

<script lang="ts">
export default {
  name: 'DanMenuList'
}
</script>

<template>
  <div
    class="menu-list"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    role="menu"
    @mouseleave="closeNextMenu"
  >
    <template v-for="(menu, i) in list" :key="menu.title">
      <div
        :class="['menu-list-item', { active: hoverItem === menu.title }]"
        @click.left="handleClickMenu(menu)"
        @mouseenter="handleHover(menu, $event)"
      >
        <span class="title">{{ menu.title }}</span>
        <span class="shortcut">{{ menu.shortcut }}</span>
        <span
          v-if="menu.children?.length"
          :class="['children-menu', codicon('chevron-right')]"
        ></span>
      </div>
      <div v-if="showSplitLine(i)" class="split-line"></div>
    </template>
    <transition>
      <DanMenuList
        v-if="activeTarget.show"
        :list="activeMenu"
        :position="activeTarget.position"
        is-child-menu
        @close="closeNextMenu"
        @close-all="$emit('close-all')"
      />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.menu-list {
  position: fixed;
  width: 315px;
  padding: 9px 0;
  z-index: v-bind(zIndex);
  background: var(--default-menu-background);
  border-radius: 5px;
  box-shadow: 0 2px 10px 0 #000;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 27px;
    padding: 0 28px;
    line-height: 27px;
    font-size: 13px;
    color: var(--base-font-color);
    cursor: pointer;

    &:hover,
    &.active {
      background: var(--active-item-background);
      color: var(--active-item-font-color);
    }
  }
}
.split-line {
  height: 1px;
  width: 100%;
  margin: 3px 0;
  background: var(--menu-split-line-color);
}
.children-menu {
  position: absolute;
  right: 15px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<script lang="ts" setup>
import { Nullable } from '@/types/common'
import DanMenuList from './DanMenuList.vue'
import { MenuListItem } from '../components/HeaderMenuBar/types'

defineProps<{
  menus: MenuListItem[]
}>()

const emit = defineEmits<{
  (event: 'open', ev: MouseEvent): void
  (event: 'close'): void
}>()

const position = ref({ x: 0, y: 0 })
const showMenu = ref(false)
const menuDom = ref<Nullable<HTMLElement>>(null)

onClickOutside(menuDom, () => handleClose())

const handleContextmenu = (ev: MouseEvent) => {
  emit('open', ev)
  position.value = {
    x: ev.clientX,
    y: ev.clientY
  }
  showMenu.value = true
}

const handleClose = () => {
  showMenu.value = false
  emit('close')
}
</script>

<template>
  <div class="contextmenu-root" @contextmenu.prevent="handleContextmenu">
    <slot></slot>
    <teleport to="body">
      <DanMenuList
        v-if="showMenu"
        ref="menuDom"
        class="contextmenu-menu-list"
        :list="menus"
        :position="position"
        @close="handleClose"
      />
    </teleport>
  </div>
</template>

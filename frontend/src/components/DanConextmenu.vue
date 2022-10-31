<script lang="ts" setup>
import { Nullable } from '@/types/common'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import DanMenuList from './DanMenuList.vue'
import { MenuListItem } from './HeaderMenuBar/types'

defineProps<{
  menus: MenuListItem[]
}>()

const emit = defineEmits<{
  (event: 'activate', ev: MouseEvent): void
  (event: 'close'): void
}>()

const position = ref({ x: 0, y: 0 })
const showMenu = ref(false)
const rootDom = ref<Nullable<HTMLElement>>(null)

onClickOutside(rootDom, () => handleClose())

const handleContextmenu = (ev: MouseEvent) => {
  emit('activate', ev)
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
  <slot class="contextmenu-root" ref="rootDom" @contextmenu.prevent="handleContextmenu"></slot>
  <teleport to="body">
    <div class="menu-portal">
      <DanMenuList
        v-if="showMenu"
        class="contextmenu-menu-list"
        :list="menus"
        :position="position"
        @close="handleClose"
      />
    </div>
  </teleport>
</template>

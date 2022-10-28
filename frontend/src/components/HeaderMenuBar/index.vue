<script lang="ts" setup>
import { useMovingWindowTitle } from './composition'
import { menuList } from './data'

const { titleDom, titleWidth } = useMovingWindowTitle()
</script>

<template>
  <header class="top-header">
    <div class="titlebar-container">
      <div class="window-appicon"></div>
      <div class="menubar" role="menubar">
        <div
          v-for="menu in menuList"
          :key="menu.title"
          class="menubar-menu-button"
          role="menuitem"
          tabindex="-1"
        >
          <div class="menubar-menu-title">{{ menu.title }}({{ menu.shortcut }})</div>
        </div>
      </div>
      <div
        class="window-title"
        ref="titleDom"
        :style="{ left: `calc(50% - ${titleWidth / 2}px)` }"
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
.window-appicon {
  background-image: url('../assets/images/download.svg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 16px;
}
.window-title {
  position: absolute;
}
</style>

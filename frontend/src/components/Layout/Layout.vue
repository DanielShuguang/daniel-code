<script lang="ts" setup>
import { isDev } from '@/utils/env-tools'
import BottomStatusBar from '../BottomStatusBar.vue'
import EditorContainer from '../EditorContainer/EditorContainer.vue'
import HeaderMenuBar from '../HeaderMenuBar/HeaderMenuBar.vue'
import LeftToolBar from '../LeftToolbar/LeftToolbar.vue'
import DanMessage from '@/ui-components/DanMessage/DanMessage.vue'
import ConfigProvider from '../ConfigProvider/ConfigProvider.vue'
</script>

<template>
  <ConfigProvider>
    <div class="ide-layout" v-uncontext="!isDev">
      <HeaderMenuBar class="ide-menu-bar" />
      <main class="ide-main-container">
        <LeftToolBar class="left-bar" />
        <div class="editor-view">
          <EditorContainer class="main-editor" />
        </div>
      </main>
      <BottomStatusBar class="bottom-operation" />

      <DanMessage />
    </div>
  </ConfigProvider>
</template>

<style scoped lang="scss">
.ide-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.ide-menu-bar {
  width: 100%;
  height: 30px;
}
.bottom-operation {
  height: 22px;
  width: 100%;
}
.ide-main-container {
  flex: 1;
  display: flex;
  width: 100%;
}
.left-bar {
  height: 100%;
}
.editor-view {
  flex: 1;
  height: 100%;
}
</style>

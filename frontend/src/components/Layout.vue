<script lang="ts" setup>
import BottomStatusBar from './BottomStatusBar.vue'
import EditorContainer from './EditorContainer.vue'
import HeaderMenuBar from './HeaderMenuBar/index.vue'
import LeftToolBar from './LeftToolbar.vue'
</script>

<template>
  <div class="ide-layout">
    <HeaderMenuBar class="ide-menu-bar" />
    <main class="ide-main-container">
      <LeftToolBar class="left-bar" />
      <div class="editor-view">
        <EditorContainer class="main-editor" />
      </div>
    </main>
    <BottomStatusBar class="bottom-operation" />
  </div>
</template>

<style scoped lang="scss">
.ide-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  height: 100%;
}
</style>

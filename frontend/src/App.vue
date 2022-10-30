<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import Layout from './components/Layout.vue'
import { useBaseStore } from './store'

const baseStore = useBaseStore()

onBeforeMount(() => {
  window.onblur = () => {
    baseStore.$patch({ isWindowActive: false })
  }
  window.onfocus = () => {
    baseStore.$patch({ isWindowActive: true })
  }
})
</script>

<template>
  <Layout />
</template>

<style>
#app {
  height: 100vh;
  width: 100vw;
  background: var(--editor-background);
}
</style>

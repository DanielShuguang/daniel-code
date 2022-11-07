<script lang="ts" setup>
import DanFileTree from '@/components/DanFileTree/index.vue'
import { useProjectSystemStore } from '@/store'

const projectStore = useProjectSystemStore()
</script>

<script lang="ts">
export default {
  name: 'file-explorer'
}
</script>

<template>
  <DanFileTree v-if="projectStore.currentProject" :root-folder="projectStore.currentProject" />
</template>

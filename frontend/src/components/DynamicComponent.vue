<script lang="ts" setup>
defineProps<{ name?: string }>()
</script>

<template>
  <component :is="name" />
</template>

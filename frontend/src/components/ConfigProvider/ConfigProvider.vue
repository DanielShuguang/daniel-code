<script lang="ts" setup>
import {
  useInitEditorInfo,
  useInitEditorTheme,
  useUpdateEditorsStorage,
  useWindowsFocusHandler
} from './composition'

useWindowsFocusHandler()
useInitEditorInfo()
useInitEditorTheme()
useUpdateEditorsStorage()
</script>

<template>
  <slot></slot>
</template>

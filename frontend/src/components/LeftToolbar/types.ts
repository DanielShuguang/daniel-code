import { Component } from 'vue'

export interface Plugin {
  title: string
  shortcut?: string
  icon: string
  pluginKey: string
  badge?: string | number
  component: string | Component
}

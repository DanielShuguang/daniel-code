import { codicon } from '@/utils/codicon'
import { Plugin } from './types'

export const plugins: Plugin[] = [
  { title: '资源管理器', pluginKey: 'explorer', icon: codicon('files'), shortcut: 'Ctrl+Shift+E' },
  { title: '搜索', pluginKey: 'search', icon: codicon('search'), shortcut: 'Ctrl+Shift+F' },
  {
    title: '源代码管理',
    pluginKey: 'source',
    icon: codicon('source-control'),
    shortcut: 'Ctrl+Shift+G'
  }
]
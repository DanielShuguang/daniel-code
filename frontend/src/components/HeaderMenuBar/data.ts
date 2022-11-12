import { EditMenuCommands, FileMenuCommands } from '@/commands/top-menu'
import { MenuListItem, TopMenuButton } from './types'

export const fileMenus: MenuListItem<keyof FileMenuCommands>[] = [
  { title: '新建文本文件', command: 'topmenu-add-text-file', type: 1, shortcut: 'Ctrl+N' },
  { title: '新建文件', command: 'topmenu-add-file', type: 1, shortcut: 'Ctrl+Alt+Windows+N' },
  { title: '新建窗口', command: 'topmenu-add-window', type: 1, shortcut: 'Ctrl+Shift+N' },

  { title: '打开文件', command: 'topmenu-open-file', type: 2, shortcut: 'Ctrl+O' },
  { title: '打开文件夹', command: 'topmenu-open-folder', type: 2, shortcut: 'Ctrl+K Ctrl+O' },
  {
    title: '打开最近的文件',
    type: 2,
    children: [
      { title: '测试1', command: 'topmenu-123' },
      { title: '测试2', command: 'topmenu-123' }
    ]
  },

  { title: '保存', command: 'topmenu-save', type: 3, shortcut: 'Ctrl+S' },
  { title: '另存为...', command: 'topmenu-save-as', type: 3, shortcut: 'Ctrl+Shift+S' },
  { title: '全部保存', command: 'topmenu-save-all', type: 3, shortcut: 'Ctrl+K S' },

  { title: '自动保存', command: 'topmenu-auto-save', type: 4 },
  { title: '首选项', command: 'topmenu-preferences', type: 4, children: [] },

  { title: '还原文件', command: 'topmenu-restore-files', type: 5 },
  { title: '关闭编辑器', command: 'topmenu-close-editor', type: 5, shortcut: 'Ctrl+F4' },
  { title: '关闭文件夹', command: 'topmenu-close-folder', type: 5, shortcut: 'Ctrl+K F' },
  { title: '关闭窗口', command: 'topmenu-close-window', type: 5, shortcut: 'Alt+F4' },

  { title: '退出', command: 'topmenu-exit', type: 6 }
]

export const editMenus: MenuListItem<keyof EditMenuCommands>[] = [
  { title: '撤销', command: 'topmenu-revoke', type: 1, shortcut: 'Ctrl+Z' },
  { title: '恢复', command: 'topmenu-recovery', type: 1, shortcut: 'Ctrl+Y' },

  { title: '剪切', command: 'topmenu-shear-cut', type: 2, shortcut: 'Ctrl+X' },
  { title: '复制', command: 'topmenu-copy', type: 2, shortcut: 'Ctrl+C' },
  { title: '复制为', type: 2, children: [] },
  { title: '粘贴', command: 'topmenu-paste', type: 2, shortcut: 'Ctrl+V' },

  { title: '查找', command: 'topmenu-search', type: 3, shortcut: 'Ctrl+F' },
  { title: '替换', command: 'topmenu-replace', type: 3, shortcut: 'Ctrl+H' },

  { title: '在文件中查找', command: 'topmenu-search-in-file', type: 4, shortcut: 'Ctrl+Shift+F' },
  { title: '在文件中替换', command: 'topmenu-replace-in-file', type: 4, shortcut: 'Ctrl+Shift+H' },

  { title: '切换行注释', command: 'topmenu-comment-line', type: 5, shortcut: 'Ctrl+/' },
  { title: '切换块注释', command: 'topmenu-comment-block', type: 5, shortcut: 'Shift+Alt+A' },
  { title: 'Emmet: 展开缩写', command: 'topmenu-emmet', type: 5, shortcut: 'Tab' }
]

export const topMenus: TopMenuButton[] = [
  { title: '文件', shortcut: 'F', children: fileMenus },
  { title: '编辑', shortcut: 'E', children: editMenus },
  { title: '选择', shortcut: 'S', children: [] },
  { title: '查看', shortcut: 'V', children: [] },
  { title: '转到', shortcut: 'G', children: [] },
  { title: '运行', shortcut: 'R', children: [] },
  { title: '终端', shortcut: 'T', children: [] },
  { title: '帮助', shortcut: 'H', children: [] }
]

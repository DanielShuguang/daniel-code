export interface TopMenuButton {
  title: string
  shortcut?: string
  children: MenuListItem[]
}

export interface MenuListItem<C = string> {
  title: string
  shortcut?: string
  command?: C
  type?: number | string
  children?: MenuListItem[]
}

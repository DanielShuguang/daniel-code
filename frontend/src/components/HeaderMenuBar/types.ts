export interface TopMenuButton {
  title: string
  shortcut: string
  children: TopMenuItem[]
}

export interface TopMenuItem {
  title: string
  shortcut: string
  command: string
  children?: TopMenuItem[]
}

export interface FileInfo {
  name: string
  path: string
  key: string
  isProject: boolean
  content: string[]
  type: string
  isBinary: boolean
}

export interface GenericContainer {
  name: string
  key: string
  component: string
}

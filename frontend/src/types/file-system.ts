import { Nullable } from './common'

export interface FileInfo {
  name: string
  path: string
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

export interface EditorDetails {
  name: string
  key: string
  type: 'widget' | 'file'
  component: string
  viewMode: boolean
  file?: FileInfo
}

export interface CurrentFileBase {
  content: string
  hasModified: boolean
  filePath: string
}

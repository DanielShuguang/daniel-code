import { FileInfo } from '@/types/file-system'
import { isObject } from 'lodash-es'

export const isFileInfo = (value: any): value is FileInfo => {
  return value && isObject(value) && 'isProject' in value && 'isBinary' in value && 'type' in value
}

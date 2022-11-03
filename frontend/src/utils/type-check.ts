import { FileInfo } from '@/types/file-system'
import { isObject } from 'lodash-es'

export const isFileInfo = (value: any): value is FileInfo => {
  return isObject(value) && 'isProject' in value && 'suffix' in value && 'type' in value
}

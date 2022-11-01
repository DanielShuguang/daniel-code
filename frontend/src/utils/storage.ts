import { Plugin } from '@/components/LeftToolbar/types'
import { Nullable } from '@/types/common'
import { FileInfo } from '@/types/file-system'
import { ProjectInfo } from '@/types/project-system'
import { isDev } from './env-tools'
import { logger } from './logger'

export interface SessionStorageKeys {}

export interface LocalStorageKeys {
  'active-plugin': Plugin
  'active-project': ProjectInfo
  'active-file': FileInfo
  'open-files': FileInfo[]
}

/**
 * 操作 sessionStorage
 */
export const codeSessionStorage = {
  set<K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (err) {
      if (isDev) {
        logger.warn(err as Error)
      }
      return false
    }
  },
  get<K extends keyof SessionStorageKeys>(key: K): Nullable<SessionStorageKeys[K]> {
    const str = sessionStorage.getItem(key)
    if (!str) {
      return null
    }
    try {
      const result = JSON.parse(str)
      return result
    } catch (err) {
      if (isDev) {
        logger.warn(err as Error)
      }
      return null
    }
  }
}

/**
 * 操作 localStorage
 */
export const codeLocalStorage = {
  set<K extends keyof LocalStorageKeys>(key: K, value: LocalStorageKeys[K]) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (err) {
      if (isDev) {
        logger.warn(err as Error)
      }
      return false
    }
  },
  get<K extends keyof LocalStorageKeys>(key: K): Nullable<LocalStorageKeys[K]> {
    const str = localStorage.getItem(key)
    if (!str) {
      return null
    }
    try {
      const result = JSON.parse(str)
      return result
    } catch (err) {
      if (isDev) {
        logger.warn(err as Error)
      }
      return null
    }
  }
}

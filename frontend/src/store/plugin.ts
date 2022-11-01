import { Plugin } from '@/components/LeftToolbar/types'
import { Nullable } from '@/types/common'
import { codeLocalStorage } from '@/utils/storage'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export const usePluginStore = defineStore('plugin-system', {
  state: () => ({
    activePlugin: <Nullable<Plugin>>null
  }),
  actions: {
    /** 修改当前激活的左侧插件栏 */
    changeActivePlugin(plugin: Plugin) {
      this.activePlugin = cloneDeep(plugin)
      codeLocalStorage.set('active-plugin', plugin)
    }
  }
})

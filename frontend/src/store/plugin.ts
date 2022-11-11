import { Plugin } from '@/components/LeftToolbar/types'
import { Nullable } from '@/types/common'
import { codeLocalStorage } from '@/utils/storage'
import { cloneDeep, omit } from 'lodash-es'
import { defineStore } from 'pinia'

export const usePluginStore = defineStore('plugin-system', {
  state: () => ({
    activePlugin: <Nullable<Omit<Plugin, 'component'>>>null
  }),
  actions: {
    /** 修改当前激活的左侧插件栏 */
    changeActivePlugin(plugin: Omit<Plugin, 'component'> | Plugin) {
      this.activePlugin = cloneDeep(omit(plugin as Plugin, ['component']))
      codeLocalStorage.set('active-plugin', plugin)
    }
  }
})

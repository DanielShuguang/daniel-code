import 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    /** 设置是否可以拖拽窗口 */
    vWindrag: typeof import('@/directives/windrag').windrag
    /** 是否禁用右键点击响应 */
    vUncontext: typeof import('@/directives/uncontext').uncontext
    /** 挂载点击命令 */
    vCommand: typeof import('@/directives/command').command
  }
}

export {}

import { KeyTypes } from '@/types/common'
import { InjectionKey, Ref } from 'vue'

export const ActiveTabKey: InjectionKey<Readonly<Ref<KeyTypes>>> = Symbol('active-tab')
export const DestroyTabKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('destroy-tab')
export const collectTabsFnKey: InjectionKey<() => void> = Symbol('collect-tabs-fn')

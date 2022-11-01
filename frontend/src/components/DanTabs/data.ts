import { KeyTypes } from '@/types/common'
import { InjectionKey, Ref } from 'vue'

export const ActiveTabKey: InjectionKey<Readonly<Ref<KeyTypes>>> = Symbol('active-tab')
export const ChangeTabKey: InjectionKey<(key: KeyTypes) => void> = Symbol('change-tab-key')

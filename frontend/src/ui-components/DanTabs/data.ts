import { KeyTypes } from '@/types/common'

export const ActiveTabKey: InjectionKey<Readonly<Ref<KeyTypes>>> = Symbol('active-tab')
export const DestroyTabKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('destroy-tab')

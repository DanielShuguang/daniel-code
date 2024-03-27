import { Nullable } from '@/types/common'
import { TimeUtils } from '@/utils/time-utils'
import { isEqual } from 'lodash-es'
import { MaybeRef } from 'vue'

export interface SWRInstance {
  data: Ref<any>
  error: Ref<string>
  isValidating: Ref<boolean>
  fn: (key: string) => Promise<any>
}

export interface SWROption {
  /** 延迟 s */
  delay?: number
  /** 是否进行深度对比 */
  deepEqual?: boolean
}

const cacheClient = new Map<string, SWRInstance>()

export const useSWR = <R>(
  key: string,
  fn: (key: string) => Promise<R>,
  option?: MaybeRef<SWROption>
) => {
  const opt = computed<SWROption>(() => unref(option) ?? {})
  const content: SWRInstance = {
    data: ref<Nullable<R>>(null),
    error: ref(''),
    isValidating: ref(false),
    fn
  }
  cacheClient.set(key, content)

  const run = async () => {
    content.isValidating.value = true
    try {
      const res: any = await content.fn(key)
      const isEq = equalFn(res, content.data.value)
      if (!isEq) {
        content.data.value = res
      }
    } catch (e) {
      const err = e as Error
      content.error.value = err.message
    } finally {
      content.isValidating.value = false
      const delayTime = opt.value.delay ? opt.value.delay * TimeUtils.Second : 5 * TimeUtils.Minute
      setTimeout(run, delayTime)
    }
  }

  const equalFn = (value: any, other: any) => {
    if (opt.value.deepEqual) {
      return isEqual(value, other)
    }
    return Object.is(value, other)
  }

  onMounted(() => {
    run()
  })

  return { data: content.data as Ref<R>, error: content.error, isValidating: content.isValidating }
}

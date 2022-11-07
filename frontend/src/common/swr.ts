import { Nullable } from '@/types/common'
import { onMounted, ref, Ref } from 'vue'

export interface SWRInstance {
  data: Ref<any>
  error: Ref<string>
  isValidating: Ref<boolean>
  fn: (key: string) => Promise<any>
}

const cacheClient = new Map<string, SWRInstance>()

export const useSWR = <R>(key: string, fn: (key: string) => Promise<R>) => {
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
      content.data.value = res
    } catch (e) {
      const err = e as Error
      content.error.value = err.stack || err.message
    } finally {
      content.isValidating.value = false
    }
  }

  onMounted(() => {
    run()
  })

  return { data: content.data as Ref<R>, error: content.error, isValidating: content.isValidating }
}

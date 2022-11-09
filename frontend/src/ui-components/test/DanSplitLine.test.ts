import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DanSplitLine from '../ui-components/DanSplitLine.vue'

type DanSplitLineProps = InstanceType<typeof DanSplitLine>['$props']

test("DanSplitLine' styles", async () => {
  const props: DanSplitLineProps = {
    defaultVector: { x: 50, y: 50 },
    position: 'fixed'
  }
  const wrapper = mount(DanSplitLine, { props })

  await nextTick()
  const el = wrapper.element as HTMLDivElement
  expect(el.style.position).toBe(props.position)
  expect(el.style.left).toBe(props.defaultVector.x + 'px')
  expect(el.style.top).toBe(props.defaultVector.y + 'px')
  expect(el.style.height).toBe('100%')
  expect(el.style.cursor).toBe('ew-resize')
})

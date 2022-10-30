import { mount } from '@vue/test-utils'
import DanMenuList, { DanMenuListProps } from '../DanMenuList.vue'

test('DanMenuList render', () => {
  const props: DanMenuListProps = {
    list: [],
    position: { x: 50, y: 50 },
    zIndex: 100
  }

  const wrapper = mount(DanMenuList, {
    props
  })

  expect(wrapper.exists()).toBeTruthy()

  const el = wrapper.element as HTMLDivElement
  expect(el.style.left).toBe(props.position.x + 'px')
  expect(el.style.top).toBe(props.position.y + 'px')
  expect(el.style.zIndex).toBe(props.zIndex)
})

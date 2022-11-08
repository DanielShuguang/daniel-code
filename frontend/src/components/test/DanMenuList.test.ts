import { getIntRandom } from '@/utils/random'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { render, fireEvent } from '@testing-library/vue'
import DanMenuList, { DanMenuListProps } from '../DanMenuList.vue'

test('DanMenuList render with list', async () => {
  const props: DanMenuListProps = {
    list: [
      { title: 'name1', shortcut: 'A' },
      { title: 'name2', shortcut: 'B' },
      { title: 'name3', shortcut: 'C' },
      { title: 'name4', shortcut: 'D' }
    ],
    position: { x: 0, y: 0 }
  }

  const wrapper = mount(DanMenuList, {
    props
  })

  expect(wrapper.exists()).toBe(true)

  props.list.forEach(item => {
    const html = wrapper.html()
    expect(html.includes(item.title)).toBe(true)
    expect(html.includes(`${item.shortcut}`)).toBe(true)
  })

  const childrenElement = wrapper.findAll('.menu-list-item')
  expect(childrenElement.length).toBe(props.list.length)
})

test("DanMenuList's position", async () => {
  const props: DanMenuListProps = {
    list: [],
    position: { x: 50, y: 50 }
  }

  const wrapper = mount(DanMenuList, {
    props
  })

  const el = wrapper.element as HTMLDivElement
  expect(el.style.left).toBe(props.position.x + 'px')
  expect(el.style.top).toBe(props.position.y + 'px')
  expect(el.style.zIndex).toBe('10')

  for (let i = 0; i < 5; i++) {
    props.position = { x: getIntRandom(1000), y: getIntRandom(1000) }
    props.zIndex = getIntRandom(1000)
    wrapper.setProps(props as any)
    await nextTick()
    expect(el.style.left).toBe(props.position.x + 'px')
    expect(el.style.top).toBe(props.position.y + 'px')
    expect(el.style.zIndex).toBe(props.zIndex.toString())
  }
})

test('DanMenuList close by esc', async () => {
  const props: DanMenuListProps = {
    list: [],
    position: { x: 50, y: 50 }
  }

  const wrapper = render(DanMenuList, {
    props
  })
  await fireEvent(window, new KeyboardEvent('keydown', { key: 'Escape' }))
  const emitted = wrapper.emitted()
  expect(emitted).toHaveProperty('close')
})

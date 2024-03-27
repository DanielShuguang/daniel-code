import { findByText } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import DanContextmenu from '../DanContextmenu.vue'
import DanMenuList from '../DanMenuList.vue'

type DanContextmenuProps = InstanceType<typeof DanContextmenu>['$props']

test('DanContextmenu render', async () => {
  const props: DanContextmenuProps = {
    menus: []
  }
  const slotClassname = 'contextmenu-demo-slot'
  const wrapper = mount(DanContextmenu, {
    props,
    slots: {
      default: `<div class="${slotClassname}"></div>`
    }
  })

  const childDom = wrapper.find<HTMLDivElement>(`.${slotClassname}`)
  expect(childDom.exists()).toBe(true)
})

test('DanContextmenu event trigger', async () => {
  const props: DanContextmenuProps = {
    menus: [
      { title: 'menu-title-1', command: 'None' },
      { title: 'menu-title-2', command: 'None' },
      { title: 'menu-title-3', command: 'None' },
      { title: 'menu-title-4', command: 'None' },
      { title: 'menu-title-5', command: 'None' }
    ]
  }
  const wrapper = mount(DanContextmenu, {
    props
  })

  await wrapper.trigger('contextmenu', { clientX: 100, clientY: 100 })
  const menuListComp = wrapper.getComponent(DanMenuList)

  for (const item of props.menus) {
    const el = await findByText(<HTMLDivElement>menuListComp.element, item.title)
    expect(el).toBeDefined()
  }

  const el = menuListComp.get('.menu-list-item')
  await el.trigger('click')
  await nextTick()
  const findResult = wrapper.findAllComponents(DanMenuList)
  expect(findResult.length).toBe(0)
})

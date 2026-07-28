import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from '../src/Tabs.vue'

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing', disabled: true },
  { id: 'security', label: 'Security' }
]

describe('Tabs', () => {
  it('marks the active tab with aria-selected true and others false', () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons[0]?.attributes('aria-selected')).toBe('true')
    expect(buttons[2]?.attributes('aria-selected')).toBe('false')
  })

  it('only puts the active tab in the natural tab order', () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons[0]?.attributes('tabindex')).toBe('0')
    expect(buttons[2]?.attributes('tabindex')).toBe('-1')
  })

  it('shows only the active panel', () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'account', tabs },
      slots: {
        account: 'Account content',
        security: 'Security content'
      }
    })
    expect(wrapper.text()).toContain('Account content')
    const securityPanel = wrapper.find('[id$="panel-security"]')
    expect(securityPanel.attributes('style')).toContain('display: none')
  })

  it('emits update:modelValue when an enabled tab is clicked', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    await wrapper.findAll('[role="tab"]')[2]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['security'])
  })

  it('does not emit update:modelValue when a disabled tab is clicked', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    await wrapper.findAll('[role="tab"]')[1]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('skips disabled tabs when moving with ArrowRight', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['security'])
  })

  it('wraps around from the last enabled tab to the first with ArrowRight', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'security', tabs } })
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['account'])
  })

  it('jumps to the last enabled tab on End', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'account', tabs } })
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['security'])
  })
})

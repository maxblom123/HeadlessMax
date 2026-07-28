import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../src/Select.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', disabled: true },
  { label: 'Cherry', value: 'cherry' }
]

describe('Select', () => {
  it('shows the placeholder when no option is selected', () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, placeholder: 'Pick a fruit' }
    })
    expect(wrapper.text()).toContain('Pick a fruit')
  })

  it('shows the selected option label when modelValue matches an option', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'cherry', options }
    })
    expect(wrapper.text()).toContain('Cherry')
  })

  it('opens the listbox on click and sets aria-expanded', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options }
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.find('[role="combobox"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('closes the listbox on Escape', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options }
    })
    const button = wrapper.find('[role="combobox"]')
    await button.trigger('click')
    await button.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('emits update:modelValue when an enabled option is clicked', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options }
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[0]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
  })

  it('does not emit update:modelValue when a disabled option is clicked', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options }
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('skips disabled options when navigating with ArrowDown', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'apple', options }
    })
    const button = wrapper.find('[role="combobox"]')
    await button.trigger('click')
    await button.trigger('keydown', { key: 'ArrowDown' })
    await button.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cherry'])
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: null, options, disabled: true }
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('renders a hidden native select for form integration when name is provided', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'apple', options, name: 'fruit' }
    })
    const native = wrapper.find('select[name="fruit"]')
    expect(native.exists()).toBe(true)
    expect(native.element.value).toBe('apple')
  })
})

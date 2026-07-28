import { describe, it, expect, beforeEach } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import Dialog from '../src/Dialog.vue'

function body() {
  return new DOMWrapper(document.body)
}

function mountWithTrigger(props: Record<string, unknown> = {}) {
  const triggerButton = document.createElement('button')
  triggerButton.textContent = 'Open dialog'
  document.body.appendChild(triggerButton)
  triggerButton.focus()

  const wrapper = mount(Dialog, {
    props: {
      modelValue: false,
      title: 'Test dialog',
      ...props
    },
    attachTo: document.body
  })

  return { wrapper, triggerButton }
}

async function wait() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('Dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render when modelValue is false', () => {
    mountWithTrigger()
    expect(body().find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders with correct ARIA attributes when modelValue is true', async () => {
    const { wrapper } = mountWithTrigger()
    await wrapper.setProps({ modelValue: true })
    const dialog = body().find('[role="dialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBeTruthy()
  })

  it('moves focus into the dialog on open', async () => {
    const { wrapper } = mountWithTrigger()
    await wrapper.setProps({ modelValue: true })
    await wait()
    const panel = body().find('[role="dialog"]').element
    expect(panel.contains(document.activeElement)).toBe(true)
  })

  it('returns focus to the triggering element on close', async () => {
    const { wrapper, triggerButton } = mountWithTrigger()
    await wrapper.setProps({ modelValue: true })
    await wait()
    await wrapper.setProps({ modelValue: false })
    await wait()
    expect(document.activeElement).toBe(triggerButton)
  })

  it('emits update:modelValue false on Escape when closeOnEscape is true', async () => {
    const { wrapper } = mountWithTrigger({ closeOnEscape: true })
    await wrapper.setProps({ modelValue: true })
    await body().find('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    const { wrapper } = mountWithTrigger({ closeOnEscape: false })
    await wrapper.setProps({ modelValue: true })
    await body().find('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes on overlay click when closeOnClickOutside is true', async () => {
    const { wrapper } = mountWithTrigger({ closeOnClickOutside: true })
    await wrapper.setProps({ modelValue: true })
    await body().find('.dialog-overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})

import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { provideFeatureFlags, useFeatureFlag } from '../src/useFeatureFlag'

function mountWithFlags(flags: Record<string, boolean>, flagKey: string, fallback?: boolean) {
  let resolvedValue: boolean | undefined

  const Child = defineComponent({
    setup() {
      const flag = useFeatureFlag(flagKey, { fallback })
      resolvedValue = flag.value
      return () => h('div', String(flag.value))
    }
  })

  const Parent = defineComponent({
    setup() {
      provideFeatureFlags(flags)
      return () => h(Child)
    }
  })

  mount(Parent)
  return resolvedValue
}

describe('useFeatureFlag', () => {
  it('resolves a flag that is set to true', () => {
    expect(mountWithFlags({ 'new-filter-ui': true }, 'new-filter-ui')).toBe(true)
  })

  it('resolves a flag that is set to false', () => {
    expect(mountWithFlags({ 'new-filter-ui': false }, 'new-filter-ui')).toBe(false)
  })

  it('falls back to false by default when a flag is missing', () => {
    expect(mountWithFlags({}, 'unknown-flag')).toBe(false)
  })

  it('falls back to a provided default when a flag is missing', () => {
    expect(mountWithFlags({}, 'unknown-flag', true)).toBe(true)
  })

  it('returns the same resolved value regardless of how many times it is called, simulating server/client consistency', () => {
    const flags = { 'new-filter-ui': true }
    const firstResolution = mountWithFlags(flags, 'new-filter-ui')
    const secondResolution = mountWithFlags(flags, 'new-filter-ui')
    expect(firstResolution).toBe(secondResolution)
  })
})

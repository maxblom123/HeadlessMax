import { inject, provide, type InjectionKey, type Ref, ref } from 'vue'

export interface FeatureFlags {
  [key: string]: boolean
}

const FLAGS_KEY: InjectionKey<FeatureFlags> = Symbol('headlessmax-feature-flags')

export function provideFeatureFlags(flags: FeatureFlags) {
  provide(FLAGS_KEY, flags)
}

export function useFeatureFlag(key: string, options?: { fallback?: boolean }): Ref<boolean> {
  const flags = inject(FLAGS_KEY, {})
  const fallback = options?.fallback ?? false
  return ref(flags[key] ?? fallback)
}

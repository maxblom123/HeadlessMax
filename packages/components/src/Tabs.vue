<script setup lang="ts">
import { computed, ref, useId } from 'vue'

interface TabItem {
  id: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue: string
  tabs: TabItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<Record<string, HTMLElement | null>>({})
const baseId = useId()

const enabledIds = computed(() => props.tabs.filter((tab) => !tab.disabled).map((tab) => tab.id))

function setTabRef(id: string, el: HTMLElement | null) {
  tabRefs.value[id] = el
}

function activate(id: string) {
  const tab = props.tabs.find((item) => item.id === id)
  if (!tab || tab.disabled) return
  emit('update:modelValue', id)
  tabRefs.value[id]?.focus()
}

function moveFocus(direction: 1 | -1) {
  const enabled = enabledIds.value
  if (enabled.length === 0) return

  const currentPosition = enabled.indexOf(props.modelValue)
  const nextPosition = (currentPosition + direction + enabled.length) % enabled.length
  const nextId = enabled[nextPosition]
  if (nextId) activate(nextId)
}

function moveToEdge(edge: 'first' | 'last') {
  const enabled = enabledIds.value
  if (enabled.length === 0) return
  const targetId = edge === 'first' ? enabled[0] : enabled[enabled.length - 1]
  if (targetId) activate(targetId)
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      moveFocus(1)
      break
    case 'ArrowLeft':
      event.preventDefault()
      moveFocus(-1)
      break
    case 'Home':
      event.preventDefault()
      moveToEdge('first')
      break
    case 'End':
      event.preventDefault()
      moveToEdge('last')
      break
  }
}
</script>

<template>
  <div>
    <div role="tablist" @keydown="handleKeydown">
      <button
        v-for="tab in tabs"
        :id="`${baseId}-tab-${tab.id}`"
        :key="tab.id"
        :ref="(el) => setTabRef(tab.id, el as HTMLElement | null)"
        type="button"
        role="tab"
        :aria-selected="tab.id === modelValue"
        :aria-controls="`${baseId}-panel-${tab.id}`"
        :aria-disabled="tab.disabled"
        :tabindex="tab.id === modelValue ? 0 : -1"
        :disabled="tab.disabled"
        @click="activate(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in tabs"
      v-show="tab.id === modelValue"
      :id="`${baseId}-panel-${tab.id}`"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`${baseId}-tab-${tab.id}`"
    >
      <slot :name="tab.id" />
    </div>
  </div>
</template>

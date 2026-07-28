<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    name?: string
  }>(),
  {
    placeholder: 'Select an option',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  open: []
  close: []
}>()

const isOpen = ref(false)
const highlightedIndex = ref(-1)
const typeaheadBuffer = ref('')
let typeaheadTimeout: ReturnType<typeof setTimeout> | undefined

const selectedOption = computed(
  () => props.options.find((option) => option.value === props.modelValue) ?? null
)

const enabledIndexes = computed(() =>
  props.options.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) indexes.push(index)
    return indexes
  }, [])
)

function open() {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
  emit('open')
}

function close() {
  isOpen.value = false
  emit('close')
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function selectOption(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return
  emit('update:modelValue', option.value)
  close()
}

function moveHighlight(direction: 1 | -1) {
  const enabled = enabledIndexes.value
  if (enabled.length === 0) return

  const currentPosition = enabled.indexOf(highlightedIndex.value)
  const nextPosition =
    currentPosition === -1 ? 0 : (currentPosition + direction + enabled.length) % enabled.length

  highlightedIndex.value = enabled[nextPosition] ?? enabled[0] ?? -1
}

function handleTypeahead(key: string) {
  clearTimeout(typeaheadTimeout)
  typeaheadBuffer.value += key.toLowerCase()

  const match = props.options.findIndex(
    (option) => !option.disabled && option.label.toLowerCase().startsWith(typeaheadBuffer.value)
  )

  if (match !== -1) {
    highlightedIndex.value = match
  }

  typeaheadTimeout = setTimeout(() => {
    typeaheadBuffer.value = ''
  }, 500)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value) {
        selectOption(highlightedIndex.value)
      } else {
        open()
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        close()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (isOpen.value) {
        moveHighlight(1)
      } else {
        open()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        moveHighlight(-1)
      } else {
        open()
      }
      break
    default:
      if (isOpen.value && event.key.length === 1) {
        handleTypeahead(event.key)
      }
  }
}

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) return
    highlightedIndex.value = props.options.findIndex((option) => option.value === props.modelValue)
  }
)
</script>

<template>
  <div class="select-root">
    <button
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-activedescendant="isOpen ? `option-${highlightedIndex}` : undefined"
      aria-haspopup="listbox"
      :disabled="disabled"
      @click="toggle"
      @keydown="handleKeydown"
    >
      {{ selectedOption?.label ?? placeholder }}
    </button>

    <ul v-if="isOpen" role="listbox">
      <li
        v-for="(option, index) in options"
        :id="`option-${index}`"
        :key="option.value"
        role="option"
        :aria-selected="option.value === modelValue"
        :aria-disabled="option.disabled"
        :class="{ highlighted: index === highlightedIndex }"
        @click="selectOption(index)"
      >
        {{ option.label }}
      </li>
    </ul>

    <select
      v-if="name"
      :name="name"
      :value="modelValue ?? ''"
      class="native-fallback"
      tabindex="-1"
      aria-hidden="true"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

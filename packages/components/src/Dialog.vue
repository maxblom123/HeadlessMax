<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { useFocusTrap } from './composables/useFocusTrap'
import { useBodyInert } from './composables/useBodyInert'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
  }>(),
  {
    closeOnClickOutside: true,
    closeOnEscape: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const overlayRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = computed(() => props.modelValue)
const titleId = useId()

useFocusTrap(panelRef, isOpen)
useBodyInert(isOpen, overlayRef)

function close() {
  emit('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    close()
  }
}

function handleOverlayClick() {
  if (props.closeOnClickOutside) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" ref="overlayRef" class="dialog-overlay" @click.self="handleOverlayClick">
      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="dialog-panel"
        @keydown="handleKeydown"
      >
        <h2 :id="titleId">
          {{ title }}
        </h2>
        <slot />
        <div v-if="$slots.footer" class="dialog-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

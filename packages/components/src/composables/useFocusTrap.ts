import { nextTick, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

export function useFocusTrap(containerRef: Ref<HTMLElement | null>, isActive: Ref<boolean>) {
  let previouslyFocused: HTMLElement | null = null

  function focusFirstElement() {
    const container = containerRef.value
    if (!container) return
    const focusable = getFocusableElements(container)
    const target = focusable[0] ?? container
    target.focus()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    const container = containerRef.value
    if (!container) return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  watch(
    isActive,
    async (active) => {
      if (active) {
        previouslyFocused = document.activeElement as HTMLElement | null
        await nextTick()
        focusFirstElement()
        document.addEventListener('keydown', handleKeydown)
      } else {
        document.removeEventListener('keydown', handleKeydown)
        previouslyFocused?.focus()
        previouslyFocused = null
      }
    },
    { flush: 'post' }
  )
}

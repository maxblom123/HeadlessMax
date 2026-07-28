import { watch, type Ref } from 'vue'

interface RestoreEntry {
  element: HTMLElement
  hadAriaHidden: string | null
  hadInert: boolean
}

export function useBodyInert(isActive: Ref<boolean>, excludeRef: Ref<HTMLElement | null>) {
  const restoreList: RestoreEntry[] = []

  function apply() {
    const exclude = excludeRef.value
    Array.from(document.body.children).forEach((child) => {
      if (!(child instanceof HTMLElement) || child === exclude) return
      restoreList.push({
        element: child,
        hadAriaHidden: child.getAttribute('aria-hidden'),
        hadInert: child.hasAttribute('inert')
      })
      child.setAttribute('aria-hidden', 'true')
      child.setAttribute('inert', '')
    })
  }

  function restore() {
    restoreList.forEach(({ element, hadAriaHidden, hadInert }) => {
      if (hadAriaHidden === null) {
        element.removeAttribute('aria-hidden')
      } else {
        element.setAttribute('aria-hidden', hadAriaHidden)
      }
      if (!hadInert) {
        element.removeAttribute('inert')
      }
    })
    restoreList.length = 0
  }

  watch(isActive, (active) => {
    if (active) {
      apply()
    } else {
      restore()
    }
  })
}

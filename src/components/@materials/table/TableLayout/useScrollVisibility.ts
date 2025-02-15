import type { ComponentPublicInstance } from 'vue'
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

export const useScrollVisibility = (refName: string) => {
  const element = useTemplateRef<ComponentPublicInstance<HTMLElement>>(refName)

  const isScrollY = ref(false)
  const isScrollX = ref(false)

  const checkScrollbar = () => {
    if (element.value) {
      isScrollY.value = element.value.$el.scrollHeight > element.value.$el.clientHeight
      isScrollX.value = element.value.$el.scrollWidth > element.value.$el.clientWidth
    }
  }

  onMounted(() => {
    checkScrollbar()
    window.addEventListener('resize', checkScrollbar)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScrollbar)
  })

  return { isScrollY, isScrollX }
}

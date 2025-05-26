import { getAllWindows, type Window } from '@tauri-apps/api/window'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDebugWindowStore = defineStore('debugWindow', () => {
  const isOpen = ref(false)
  const debugWindow = ref<Window | null>(null)
  getAllWindows().then((windows) => {
    debugWindow.value =
      windows.find((window) => window.label === 'debug') ?? null
  })

  const open = () => {
    if (!debugWindow.value) return
    debugWindow.value.show()
    isOpen.value = true
  }

  const focus = async () => {
    if (!debugWindow.value) return
    const isMinimized = await debugWindow.value.isMinimized()
    if (isMinimized) {
      debugWindow.value.unminimize()
    }
    debugWindow.value.setFocus()
  }

  const close = () => {
    if (!debugWindow.value) return
    debugWindow.value.hide()
    isOpen.value = false
  }

  return {
    isOpen,
    open,
    close,
    focus
  }
})

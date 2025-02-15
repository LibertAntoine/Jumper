<script setup lang="ts">
import TitleBar from './components/TitleBar/TitleBar.vue'
import Toaster from '@@materials/ui/toast/Toaster.vue'

import { RouterView } from 'vue-router'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({ disableTransition: false })
</script>

<template>
  <div class="h-screen overflow-hidden">
    <TitleBar/>
    <main id="main" class="mt-[32px] h-[calc(100%-32px)] overflow-auto">
      <RouterView/>
    </main>
  </div>
  <Toaster />
</template>

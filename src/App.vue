<script setup lang="ts">
import TitleBar from './components/TitleBar/TitleBar.vue'
import DebugTitleBar from './components/TitleBar/DebugTitleBar.vue'
import Toaster from '@@materials/ui/toast/Toaster.vue'

import { RouterView, useRoute } from 'vue-router'
import { useColorMode } from '@vueuse/core'

useColorMode({ disableTransition: false })
const route = useRoute()
</script>

<template>
  <div class="h-screen overflow-hidden">
    <TitleBar v-if="route.name !== 'debug'"/>
    <DebugTitleBar v-if="route.name === 'debug'"/>
    <main id="main" class="mt-[32px] h-[calc(100%-32px)]">
      <RouterView />
    </main>
  </div>
  <Toaster />
</template>

<template>
  <div class="flex h-full">
    <MainMenu />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import MainMenu from './MainMenu.vue'
import { RouterView } from 'vue-router'
</script>

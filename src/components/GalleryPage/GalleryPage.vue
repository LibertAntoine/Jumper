<template>
  <div class="flex flex-wrap p-4 gap-4 justify-center">
    <GalleryItem
      class="h-[150px] w-[130px]"
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import type { Item } from '@@types'
import { ref } from 'vue'
import GalleryItem from './GalleryItem.vue'

const items = ref<Item[]>([
  {
    id: '1',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '2',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '3',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '4',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '5',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '6',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '7',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '8',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '9',
    name: 'Blender',
    image: '/blender-logo.png'
  },
  {
    id: '10',
    name: 'Blender',
    image: '/blender-logo.png'
  }
])
</script>

<template>
  <div class="border-r bg-muted/40">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="w-[200px] flex-1">
        <nav class="flex h-full w-full flex-col px-2 py-2 text-sm font-medium">
          <div v-for="item in menuItems" :key="item.title">
            <Collapsible
              as-child
              class="group/collapsible w-full"
              :defaultOpen="
                item.children?.some((c) =>
                  $route.matched.some((r) => r.name == c.page)
                )
              "
              v-slot="{ open }"
              v-if="item.condition()"
            >
              <CollapsibleTrigger>
                <component
                  :is="item.page ? 'router-link' : 'div'"
                  :to="{ name: item.page }"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground
                    transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                  :class="{
                    'bg-slate-100 text-primary dark:bg-slate-800 dark:text-primary':
                      $route.matched.some((r) => r.name == item.page),
                    'dark:text-slate-300': !$route.matched.some(
                      (r) => r.name == item.page
                    )
                  }"
                >
                  <component v-if="item.icon" :is="item.icon" class="h-4 w-4" />
                  <p class="flex-grow text-left">{{ item.title }}</p>
                  <ChevronRight
                    v-if="item.children"
                    class="group/collapsible/trigger h-4 w-4 transition-transform duration-300"
                    :class="{
                      'rotate-90': open
                    }"
                  />
                </component>
              </CollapsibleTrigger>
              <CollapsibleContent
                v-if="item.children"
                class="mb-1 ml-5 border-l border-slate-200 pl-1 dark:border-slate-300"
              >
                <template v-for="child in item.children" :key="child.title">
                  <RouterLink
                    v-if="child.condition()"
                    :to="{ name: child.page }"
                    class="mt-1 flex items-center gap-3 rounded-lg px-2 py-[6px] text-muted-foreground
                      transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                    :class="{
                      'bg-slate-100 text-primary dark:bg-slate-800 dark:text-primary':
                        $route.matched.some((r) => r.name == child.page),
                      'dark:text-slate-300': !$route.matched.some(
                        (r) => r.name == child.page
                      )
                    }"
                  >
                    <p class="text-sm">{{ child.title }}</p>
                  </RouterLink>
                </template>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <Button
            variant="ghost"
            class="justify-start text-slate-400 text-sm transition-colors hover:text-destructive
              dark:text-slate-500 dark:hover:text-destructive px-3 mt-auto mb-2"
              @click="authUserStore.signOut"
          >
            <LogOut />
            Logout
          </Button>

          <RouterLink
            :to="{ name: 'home' }"
            class=" flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground
              transition-all hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft class="h-4 w-4" />
            <p class="flex-grow text-left">Back to home</p>
          </RouterLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthUserStore, useAuthConfigStore } from '@/stores'
import { RouterLink } from 'vue-router'
import { Button } from '@@materials/ui/button'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@@materials/ui/collapsible'

import {
  ChevronLeft,
  ChevronRight,
  Carrot,
  User,
  Users,
  LogOut
} from 'lucide-vue-next'

const authUserStore = useAuthUserStore()
const authConfigStore = useAuthConfigStore()
console.log(authConfigStore.isScimEnabled)
const menuItems = [
  {
    title: 'My account',
    icon: User,
    condition: () => true,
    children: [
      {
        title: 'Profile',
        page: 'profile',
        condition: () => true
      },
      {
        title: 'Appearance',
        page: 'appearance',
        condition: () => true
      }
    ]
  },

  {
    title: 'Users',
    icon: Users,
    condition: () => authUserStore.isSuperAdmin,
    children: [
      {
        title: 'Users',
        page: 'all-users',
        condition: () => true
      },
      {
        title: 'Groups',
        page: 'groups',
        condition: () => authConfigStore.isScimEnabled
      },
      {
        title: 'Roles',
        page: 'roles',
        condition: () => true
      }
    ]
  },
  {
    title: 'Actions',
    page: 'actions',
    icon: Carrot,
    condition: () => authUserStore.isSuperAdmin
  }
]
</script>

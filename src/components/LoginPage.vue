<template>
  <div
    class="relative flex h-full items-center justify-center gap-[150px] bg-slate-50
      dark:bg-[#0e1c24]"
  >
    <div class="relative w-[300px] max-lg:hidden">
      <img
        v-if="isDark"
        class="fade-border-black z-10 object-cover"
        src="@/assets/rabbit-dark.png"
        alt="Jumper Logo"
      />
      <img
        v-else
        class="fade-border z-10 object-cover"
        src="@/assets/rabbit.png"
        alt="Jumper Logo"
      />
    </div>
    <div
      class="flex w-full flex-col gap-4 rounded-md bg-white p-8 shadow-md dark:bg-slate-900
        sm:max-w-sm"
    >
      <div class="flex flex-col gap-3">
        <h1
          class="mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight dark:text-slate-200
            lg:text-5xl"
        >
          Jumper
        </h1>
      </div>
      <div v-if="!isBackendReachable" class="flex flex-col gap-6">
        <div>
          <Label for="backend-url">Backend URL</Label>
          <Input
            id="backend-url"
            required
            placeholder="https://jumper.example.com"
            v-model.trim="backendUrl"
            @keyup.enter="setBackendUrl"
          />
        </div>
        <div>
          <Button
            size="sm"
            class="w-full"
            :disabled="!backendUrl"
            @click="setBackendUrl"
          >
            <Loader2 v-if="isCheckingBackendUrl" class="animate-spin" />
            <span v-else>Connect</span>
          </Button>
        </div>
      </div>
      <template v-else>
        <form
          v-if="isEmailEnabled"
          class="flex flex-col gap-3"
          @submit.prevent="login"
        >
          <div class="grid w-full items-center gap-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="text" required v-model.trim="email" />
          </div>
          <div class="grid w-full items-center gap-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              v-model.trim="password"
            />
          </div>

          <div value="flex flex-col">
            <div class="mt-1 grid w-full items-center gap-1.5">
              <Button type="submit" size="sm" class="w-full"> Login </Button>
            </div>
          </div>
        </form>
        <div v-if="isEmailEnabled && isOidcEnabled" class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div
          v-if="isOidcEnabled"
          class="grid w-full max-w-sm items-center gap-1.5"
        >
          <Button
            id="oidc-login-button"
            size="sm"
            class="w-full"
            @click="redirectToOidcProvider"
          >
            Login with {{ ssoDiplayName }}
          </Button>
        </div>
      </template>
    </div>
    <div
      v-if="isBackendReachable"
      class="absolute bottom-1 right-2 flex items-center gap-1 text-center text-xs italic
        text-slate-400/80 dark:text-slate-500/80"
    >
      <p>host : {{ backendUrl }}</p>
      <button
        class="transition-colors hover:text-slate-600 dark:hover:text-slate-300"
        @click="unsetBackendUrl"
      >
        <Edit class="size-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from '@@materials/ui/toast'
import jumper from '@/services/jumper'

import { useAuthConfigStore, useAuthUserStore } from '@/stores'
import { useDark } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { Loader2, Edit } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { Input } from '@@materials/ui/input'
import { Label } from '@@materials/ui/label'

const isDark = useDark()

const authConfigStore = useAuthConfigStore()
const { isEmailEnabled, isOidcEnabled, ssoDiplayName, oidcRedirectUrl } =
  storeToRefs(authConfigStore)
const loggedUser = useAuthUserStore()
const router = useRouter()

const redirectToOidcProvider = () => {
  if (!oidcRedirectUrl.value) return
  window.location.href = oidcRedirectUrl.value
}

const isBackendReachable = ref(
  jumper.client.jumperClient.defaults.baseURL !== undefined
)
const backendUrl = ref(jumper.client.jumperClient.defaults.baseURL || '')
const isCheckingBackendUrl = ref(false)
const email = ref('')
const password = ref('')
const { toast } = useToast()

async function login() {
  if (email.value && password.value) {
    const errorMessage = await loggedUser.signIn(email.value, password.value)
    if (errorMessage) {
      toast({
        title: 'Failed to login.',
        description: errorMessage,
        variant: 'destructive'
      })
      return
    }
    if (router.currentRoute.value.query.redirect) {
      router.push(router.currentRoute.value.query.redirect as string)
    } else {
      router.push({ name: 'home' })
    }
  }
}

const setBackendUrl = async () => {
  isCheckingBackendUrl.value = true
  localStorage.setItem('jumper-backend-url', backendUrl.value)
  await jumper.client.setBackendUrl()
  isCheckingBackendUrl.value = false
  if (!jumper.client.jumperClient.defaults.baseURL) {
    toast({
      title: 'Failed to set backend URL.',
      description: 'Please check the URL and try again.',
      variant: 'destructive'
    })
    return
  }
  loggedUser.refetch()
  authConfigStore.refetch()
  isBackendReachable.value = true
}

const unsetBackendUrl = () => {
  jumper.client.jumperClient.defaults.baseURL = undefined
  isBackendReachable.value = false
}
</script>

<style>
.fade-border {
  mask-image: linear-gradient(
      to right,
      transparent 0px,
      black 20px,
      black calc(100% - 20px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0px,
      black 20px,
      black calc(100% - 20px),
      transparent 100%
    );
  mask-composite: intersect;
  -webkit-mask-image: linear-gradient(
      to right,
      transparent 0px,
      black 20px,
      black calc(100% - 20px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0px,
      black 20px,
      black calc(100% - 20px),
      transparent 100%
    );
  -webkit-mask-composite: destination-in;
}

.fade-border-black {
  mask-image: linear-gradient(
      to right,
      transparent 0px,
      black 50px,
      black calc(100% - 50px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0px,
      black 50px,
      black calc(100% - 50px),
      transparent 100%
    );
  mask-composite: intersect;
  -webkit-mask-image: linear-gradient(
      to right,
      transparent 0px,
      black 50px,
      black calc(100% - 50px),
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0px,
      black 50px,
      black calc(100% - 50px),
      transparent 100%
    );
  -webkit-mask-composite: destination-in;
}
</style>

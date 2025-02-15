<template>
  <div
    class="relative flex h-full items-center justify-center gap-[150px] bg-slate-100 dark:bg-slate-800"
  >
    <div class="w-[350px] max-lg:hidden">
      <img
        class="object-cover"
        src="@/assets/jumper-asset.png"
        alt="Jumper Logo"
      />
    </div>
    <div
      class="flex w-full flex-col gap-4 rounded-md bg-white p-8 shadow-md sm:max-w-sm dark:bg-slate-900"
    >
      <div class="flex flex-col gap-3">
        <h1
          class="mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-slate-200"
        >
          Jumper
        </h1>
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from '@@materials/ui/toast'

import { useAuthConfigStore, useAuthUserStore } from '@/stores'
import { useRouter } from 'vue-router'

import { Button } from '@@materials/ui/button'
import { Input } from '@@materials/ui/input'
import { Label } from '@@materials/ui/label'

const { isEmailEnabled, isOidcEnabled, ssoDiplayName, oidcRedirectUrl } =
  storeToRefs(useAuthConfigStore())
const loggedUser = useAuthUserStore()
const router = useRouter()

const redirectToOidcProvider = () => {
  if (!oidcRedirectUrl.value) return
  window.location.href = oidcRedirectUrl.value
}

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
</script>

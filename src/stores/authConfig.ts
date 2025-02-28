import jumper from '@/services/jumper'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuery } from '@/composables/query/useQuery'

export const useAuthConfigStore = defineStore('authConfig', () => {
  const query = useQuery(['authConfig'], jumper.auth.getConfig)
  const configState = ref<'unloaded' | 'loading' | 'loaded'>('unloaded')

  const authConfig = query.data
  const isFetching = query.isFetching
  const errorMessage = query.errorMessage
  const fetch = query.refetch

  const isScimEnabled = computed(() => authConfig.value?.scimEnabled ?? false)
  const isOidcEnabled = computed(() =>
    authConfig.value?.providers.some((provider) => provider.id === 'oidc')
  )
  const isEmailEnabled = computed(() =>
    authConfig.value?.providers.some((provider) => provider.id === 'email')
  )
  const ssoDiplayName = computed(
    () =>
      authConfig.value?.providers.find((provider) => provider.id === 'oidc')
        ?.name ?? 'SSO'
  )
  const oidcRedirectUrl = computed(
    () => {
      const authUrl =  authConfig.value?.providers.find((provider) => provider.id === 'oidc')
        ?.authUrl ?? ''
      return (authUrl) ? `http://localhost:8000/${authUrl}` : null
    }
  )
  const isSSOEnabled = computed(() => isOidcEnabled.value || isScimEnabled.value)

  return {
    configState,
    authConfig,
    isFetching,
    errorMessage,
    isScimEnabled,
    isSSOEnabled,
    isOidcEnabled,
    isEmailEnabled,
    ssoDiplayName,
    oidcRedirectUrl,
    fetch
  }
})

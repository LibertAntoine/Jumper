import type { RouteLocationNormalized, RouteRecordName } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthUserStore, useAuthConfigStore } from '@/stores'

type pagePermission = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => boolean

export const usePagePermissions = async (): Promise<{
  [key: RouteRecordName]: pagePermission
}> => {
  const authUserStore = useAuthUserStore()
  const { isAuthenticated, isSuperAdmin, isFetching } =
    storeToRefs(useAuthUserStore())
  const { isScimEnabled } = storeToRefs(useAuthConfigStore())
  if (isFetching.value) {
    await authUserStore.refetch()
  }
  return {
    login: () => true,
    account: () => isAuthenticated.value,
    appearance: () => isAuthenticated.value,
    home: () => isAuthenticated.value,
    settings: () => isAuthenticated.value,
    actions: () => isSuperAdmin.value,
    users: () => isSuperAdmin.value,
    roles: () => isSuperAdmin.value,
    groups: () => isSuperAdmin.value && isScimEnabled.value,

  }
}

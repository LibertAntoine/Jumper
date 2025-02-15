import type { RouteLocationNormalized, RouteRecordName } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores'

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
  if (isFetching.value) {
    await authUserStore.refetch()
  }
  return {
    login: () => true,
    home: () => isAuthenticated.value,
    settings: () => isAuthenticated.value,
    account: () => true,
  }
}

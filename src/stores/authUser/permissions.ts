import { type Ref, computed } from 'vue'
import type { DetailedUser } from '@@types'

export const usePermissions = (user: Ref<DetailedUser | undefined | null>) => {
  const isAuthenticated = (
    user: DetailedUser | undefined | null
  ): user is DetailedUser => user !== undefined && user !== null

  const isSuperAdmin = computed(
    () =>
      isAuthenticated(user.value) &&
      (user.value.isSuperuser || user.value.isSuperuserGroupMember)
  )

  return {
    isAuthenticated: computed(() => isAuthenticated(user.value)),
    isSuperAdmin
  }
}

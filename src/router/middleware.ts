import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePagePermissions } from '@/router/pagePermissions'

export const userAuthorisationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const pagePermisions = await usePagePermissions()
  for (const record of to.matched) {
    if (record.name === undefined) throw new Error('Route name is not defined')
    const checkPermissions = pagePermisions[record.name]
    if (!checkPermissions) continue
    if (!checkPermissions(to, from)) {
      // TODO: add redirect and unauthorized message (via meta)
      return next({ name: 'login' })
    }
  }
  next()
}
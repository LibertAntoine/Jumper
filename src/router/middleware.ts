import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePagePermissions } from '@/router/pagePermissions'
import jumper from '@/services/jumper'

export const userAuthorisationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!jumper.client.jumperClient.defaults.baseURL) await jumper.client.setBackendUrl()
  if (!jumper.client.jumperClient.defaults.baseURL) return next({ name: 'login' })
  const pagePermisions = await usePagePermissions()
  for (const record of to.matched) {
    if (record.name === undefined) throw new Error('Route name is not defined')
    const checkPermissions = pagePermisions[String(record.name)]
    if (!checkPermissions) continue
    if (!checkPermissions(to, from)) {
      // TODO: add redirect and unauthorized message (via meta)
      return next({ name: 'login' })
    }
  }
  next()
}
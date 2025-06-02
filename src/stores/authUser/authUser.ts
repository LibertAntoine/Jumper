import { defineStore } from 'pinia'
import jumper from '@/services/jumper'
import { usePermissions } from './permissions'
import type { User } from '@@types'
import { useQuery } from '@/composables/query/useQuery'

export const useAuthUserStore = defineStore('authUser', () => {
  const query = useQuery(['authUser'], fetchUser)
  const user = query.data
  const isFetching = query.isFetching
  const errorMessage = query.errorMessage
  const setUser = query.setData
  const refetch = query.refetch

  async function fetchUser() {
    // TODO: optimize number of requests
    if (await jumper.auth.isAuthenticated()) {
      const authenticatedUser = await jumper.users.getAuthUser()
      if (!authenticatedUser) {
        signOut()
        return null
      }
      return authenticatedUser
    }
    console.warn('User is not authenticated')
    return null
  }

  const signIn = async (email: User['email'], password: string) => {
    const { error } = await jumper.auth.login(email, password)
    if (error) {
      return error as string
    }
    const loggedUser = await jumper.users.getAuthUser()
    if (!loggedUser) {
      signOut()
      return undefined
    }
    setUser(() => loggedUser)
  }

  async function signOut() {
    await jumper.auth.logout()
    window.location.href = '/login'
  }

  const update = async (data: Partial<User>) => {
    if (!user.value) throw new Error('User not found')
    const newUser = await jumper.users.update(user.value.id, data)
    if (!newUser) return
    setUser((old) => {
      if (!old) return null
      return {
        ...old,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    })

    return user.value
  }

  const updateProfilePicture = async (file: File) => {
    if (!user.value) throw new Error('User not found')
    const result = await jumper.users.updateProfilePicture(user.value.id, file)
    setUser((old) => {
      if (!old) return undefined
      return { ...old, profilePictureUrl: result.profilePictureUrl }
    })
    return result
  }
  return {
    user,
    signIn,
    signOut,
    isFetching,
    refetch,
    errorMessage,
    ...usePermissions(user),
    update,
    updateProfilePicture
  }
})

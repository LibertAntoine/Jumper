import type { User } from '@@types'
import { watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useIndex, useQuery } from '@/composables'
import { useAuthUserStore } from './authUser'

import {
  listUsers,
  updateUser,
  deleteUser,
  createUser,
  updateUserProfilePicture
} from '@/services/owl/users'

export const useUsersStore = defineStore('users', () => {
  const query = useQuery(['users'], listUsers)
  const authUserStore = useAuthUserStore()
  const { user: authUser } = storeToRefs(authUserStore)

  const users = query.data
  const usersById = useIndex(users, 'id')
  const isFetching = query.isFetching
  const errorMessage = query.errorMessage
  const fetch = query.refetch
  const setUsers = query.setData

  const create = async (user: Partial<User>) => {
    const newUser = await createUser(user)
    setUsers((old) => [...old, newUser])
  }

  const update = async (id: User['id'], user: Partial<User>) => {
    if (authUserStore.user?.id === id) return await authUserStore.update(user)
    const updatedUser = await updateUser(id, user)
    if (!updatedUser) return
    setUsers((old) =>
      old.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    )
    return updatedUser
  }

  const updateProfilePicture = async (id: User['id'], file: File) => {
    if (authUserStore.user?.id === id)
      return await await authUserStore.updateProfilePicture(file)
    const { profilePictureUrl } = await updateUserProfilePicture(id, file)
    setUsers((old) => {
      if (!old) return undefined
      return old.map((user) =>
        user.id === id ? { ...user, profilePictureUrl } : user
      )
    })
  }

  const remove = async (userId: User['id']) => {
    await deleteUser(userId)
    setUsers((old) => old.filter((user) => user.id !== userId))
  }
  
  watch(
    () => authUser,
    (value) => {
      if (!value) return
      setUsers((old) =>
        old?.map((user) => {
          if (!authUser.value) return user
          return user.id === authUser.value?.id
            ? {
                ...user,
                username: authUser.value.username,
                email: authUser.value.email,
                firstName: authUser.value.firstName,
                lastName: authUser.value.lastName,
                profilePictureUrl: authUser.value.profilePictureUrl
              }
            : user
        })
      )
    }
  )

  const $reset = () => {
    setUsers(() => undefined)
  }

  return {
    users,
    usersById,
    isFetching,
    errorMessage,
    fetch,
    create,
    update,
    updateProfilePicture,
    remove,
    $reset
  }
})

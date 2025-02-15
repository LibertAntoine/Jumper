import type { User, DetailedUser, Group, Page } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getAuthUser = async () => {
  const response = await jumperClient.get<DetailedUser>('/users/me')
  if (response.status !== 200) {
    console.error('Failed to fetch auth user', response)
    return null
  }
  return response.data
}

export const getUsers = async (page: number = 1, limit: number = 50) => {
  const response = await jumperClient.get<Page<User>>('/users', {
    params: { page, limit }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const createUser = async (user: Partial<User>) => {
  const response = await jumperClient.post<User>('/users', user)
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const updateUser = async (userId: User['id'], user: Partial<User>) => {
  const response = await jumperClient.patch<User>(`/users/${userId}`, user)
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const updateUserProfilePicture = async (id: User['id'], data: File) => {
  const formData = new FormData()
  formData.append('profile_picture', data)
  const response = await jumperClient.put<{
    profilePictureUrl: User['profilePictureUrl']
  }>(`/users/${id}/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const deleteUser = async (userId: User['id']) => {
  const response = await jumperClient.delete(`/users/${userId}`)
  if (response.status !== 204) throw new JumperBackendError(response)
}

export const getGroups = async () => {
  const response = await jumperClient.get<Group[]>('/groups')
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

/**
 * Check if an user with the same username exist
 * @param username The name of the user to check existence.
 * @returns True if an user with the same name exist, else False
 */
export const isUserWithUsernameExist = async (
  username: string
): Promise<Boolean> =>
  (await jumperClient.get(`/users/exists?username=${username}`)).data

/**
 * Check if an user with the same email exist
 * @param email The email of the user to check existence.
 * @returns True if an user with the same email exist, else False
 */
export const isUserWithEmailExist = async (email: string): Promise<Boolean> =>
  (await jumperClient.get(`/users/exists?email=${email}`)).data

/**
 * Check if the user is the last admin.
 * @param userId The id of the user.
 * @returns True if the user is the last admin, else False.
 */
export const isLastAdmin = async (userId: User['id']): Promise<boolean> => {
  const response = await jumperClient.get(`/users/${userId}/is-last-admin`)
  if (response.status !== 200) {
    throw new Error('Failed to check if user is last admin')
  }
  return response.data
}


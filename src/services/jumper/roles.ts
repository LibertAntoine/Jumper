import type { Role, Page, DetailedRole } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getDetailedRoles = async (params: {
  page?: number
  limit?: number
  search?: string
  ordering?: string
}) => {
  const { page = 1, limit = 25, search, ordering } = params
  const response = await jumperClient.get<Page<DetailedRole>>('/v1/roles', {
    params: { page, limit, search, ordering, detailed: true }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const create = async (role: Partial<Role>) => {
  const response = await jumperClient.post<Role>('/v1/roles', role)
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const update = async (roleId: Role['id'], role: Partial<Role | DetailedRole>) => {
  const response = await jumperClient.patch<Role>(`/v1/roles/${roleId}`, role)
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const remove = async (roleId: Role['id']) => {
  const response = await jumperClient.delete(`/v1/roles/${roleId}`)
  if (response.status !== 204) throw new JumperBackendError(response)
}

export const addUsers = async (roleId: Role['id'], userIds: number[]) => {
  const response = await jumperClient.post(`/v1/roles/${roleId}/users`, userIds)
  if (response.status !== 200) throw new JumperBackendError(response)
}

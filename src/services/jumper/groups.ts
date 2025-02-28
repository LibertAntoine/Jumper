import type { Group, Page } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getGroups = async (params: {
  page?: number
  limit?: number
  search?: string
  ordering?: string
}) => {
  const { page = 1, limit = 25, search, ordering } = params
  const response = await jumperClient.get<Page<Group>>('/groups', {
    params: { page, limit, search, ordering }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}
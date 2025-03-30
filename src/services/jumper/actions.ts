import type { Action, PlayableAction, DetailedAction, Page } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getMyActions = async () => {
  const response = await jumperClient.get<PlayableAction[]>('/actions/mine')
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const getActions = async (params: {
  page?: number
  limit?: number
  search?: string
  ordering?: string
}) => {
  const { page = 1, limit = 25, search, ordering } = params
  const response = await jumperClient.get<Page<Action>>('/actions', {
    params: { page, limit, search, ordering }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const create = async (action: Partial<Action>) => {
  const response = await jumperClient.post<Action>('/actions', action)
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const update = async (
  actionId: Action['id'],
  action: Partial<Action>,
  params: {
    detailed?: boolean
  } = {}
) => {
  const response = await jumperClient.patch<Action>(
    `/actions/${actionId}`,
    action,
    { params }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

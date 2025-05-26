import type {
  ActionDataVersion,
  Action,
  PlayableAction,
  DetailedAction,
  Page,
  ActionPermissions
} from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getMyActions = async () => {
  const response = await jumperClient.get<PlayableAction[]>('/v1/actions/mine')
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
  const response = await jumperClient.get<Page<Action>>('/v1/actions', {
    params: { page, limit, search, ordering }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const getDetailedAction = async (actionId: Action['id']) => {
  const response = await jumperClient.get<DetailedAction>(
    `/v1/actions/${actionId}`,
    {
      params: { detailed: true }
    }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const create = async (action: Partial<Action>) => {
  const response = await jumperClient.post<Action>('/v1/actions', action)
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const update = async (
  actionId: Action['id'],
  action: Partial<DetailedAction>
) => {
  const response = await jumperClient.patch<DetailedAction>(
    `/v1/actions/${actionId}`,
    action,
    { params: { detailed: true } }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data 
}

export const searchPermissions = async (search: string) => {
  const response = await jumperClient.get<ActionPermissions>(
    '/v1/actions/search',
    {
      params: { query: search }
    }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const remove = async (actionId: Action['id']) => {
  const response = await jumperClient.delete(`/v1/actions/${actionId}`)
  if (response.status !== 204) throw new JumperBackendError(response)
  return response.data
}

export const updateActionThumbnail = async (
  id: Action['id'],
  thumbnail: File
) => {
  const formData = new FormData()
  formData.append('thumbnail', thumbnail)
  const response = await jumperClient.put<{
    thumbnailUrl: string
  }>(`/v1/actions/${id}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.status !== 200) {
    throw new Error('Action thumbnail update failed')
  }
  return response.data
}

export const getVersions = async (actionId: DetailedAction['id']) => {
  const response = await jumperClient.get<ActionDataVersion[]>(`/v1/actions/${actionId}/versions`)
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}
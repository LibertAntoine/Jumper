import { jumperClient } from '@/services/jumper/client'
import type { AuthConfig } from '@@types'

const LOGIN_PAGE_PATH: string = '/login'

export const login = async (email: string, password: string) => {
  const response = await jumperClient.post('/v1/auth', {
    email,
    password
  })
  if (response.status !== 200) {
    console.error('Failed to login', response)
    return { error: 'Failed to login' }
  }
  return { error: null }
}

export const setTokens = async (access: string, refresh: string) => {
  const response = await jumperClient.post('/v1/auth/set-tokens', {
    access,
    refresh
  })
  if (response.status !== 200) {
    console.error('Failed to set tokens', response)
    throw new Error('Failed to set tokens')
  }
  return { error: null }
}

export const logout = async () => await jumperClient.post('/v1/auth/logout')

export const getConfig = async (): Promise<AuthConfig> => {
  const response = await jumperClient.get('/v1/auth/config')
  if (response.status !== 200) {
    throw new Error('Failed to get auth config')
  }
  return response.data
}

export const isAuthenticated = async () => {
  const response = await jumperClient.get('/v1/auth/status')
  if (response.status !== 200) return false
  return response.data.authenticated
}

jumperClient.interceptors.response.use((response) => {
  if (response.status === 401 && window.location.pathname !== LOGIN_PAGE_PATH ) {
    window.location.href = LOGIN_PAGE_PATH
  }
  return response
})

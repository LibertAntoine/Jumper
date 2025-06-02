import { invoke } from '@tauri-apps/api/core'
import axios, { type AxiosResponse } from 'axios'
import { camelToSnake, snakeToCamel } from '@/services/utils'

export const jumperClient = axios.create({
  baseURL: undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Agent': 'jumper-client'
  },
  validateStatus: Boolean
})

export const setBackendUrl = async () => {
  let backendUrl = await invoke<string | null>('get_env_var', {
    key: 'JUMPER_BACKEND_URL'
  })
  const lastBackendUrlViaEnv =
    localStorage.getItem('jumper-backend-url-via-env') || null
  if (backendUrl && backendUrl !== lastBackendUrlViaEnv) {
    // If the value of backend URL environnement variable has changed from last execution,
    // use it as the new backend URL.
    backendUrl
      ? localStorage.setItem('jumper-backend-url-via-env', backendUrl)
      : localStorage.removeItem('jumper-backend-url-via-env')
  } else {
    // Else, prefer the last used backend URL stored in localStorage.
    backendUrl = localStorage.getItem('jumper-backend-url') || backendUrl
  }
  if (backendUrl) {
    localStorage.setItem('jumper-backend-url', backendUrl)
    jumperClient.defaults.baseURL = backendUrl
    try {
      const info =  await get_info()
      if (!info || info.name !== 'Carrot') throw new Error('Invalid backend info')
    } catch (error) {
      jumperClient.defaults.baseURL = undefined
      localStorage.removeItem('jumper-backend-url')
      console.warn('Failed to fetch backend info:', error)
    }
  } else {
    localStorage.removeItem('jumper-backend-url')
  }
}

export const get_info = async () => {
  const response = await jumperClient.get('/v1/info')
  if (response.status !== 200) {
    throw new JumperBackendError(response)
  }
  return response.data
}

jumperClient.interceptors.request.use((config) => {
  if (config.headers['Content-Type'] === 'application/json') {
    config.data = camelToSnake(config.data)
  }
  return config
})

jumperClient.interceptors.response.use((response) => {
  if (response.headers['content-type'] === 'application/json') {
    response.data = snakeToCamel(response.data)
  }
  return response
})

export class JumperBackendError extends Error {
  constructor(response: AxiosResponse) {
    const message = Object.values(response.data)
      .map((value) => {
        if (typeof value === 'string') return value
        if (Array.isArray(value)) return value.join(', ')
        return ''
      })
      .join(' - ')

    super(message)
    Object.setPrototypeOf(this, JumperBackendError.prototype)
    this.name = 'JumperBackendError'
  }
}

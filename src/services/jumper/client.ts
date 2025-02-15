import axios, { type AxiosResponse } from 'axios'

import { camelToSnake, snakeToCamel } from '@/services/utils'

export const jumperClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: Boolean
})

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

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert camelCase to snake_case.
 * @param obj The camelCase object to covert to snake_case.
 * @returns The object in snake_case.
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const snakeKey = key.replace(
        /(?<!^|\s)[A-Z]/g,
        (match) => `_${match.toLowerCase()}`
      )
      return [snakeKey, camelToSnake(value)]
    })
  )
}

/**
 * Convert snake_case to camelCase.
 * @param obj The snake_case object to covert to camelCase.
 * @returns The object in camelCase.
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      )
      return [camelKey, snakeToCamel(value)]
    })
  )
}

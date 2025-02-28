// This is a generic interface for a page of results
export interface Page<T> {
  readonly count: number
  readonly results: T[]
}

// This represents the order of a dataset
export interface Order {
  field: string
  direction: 'asc' | 'desc'
}

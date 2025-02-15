// This is a generic interface for a page of results
export interface Page<T> {
    readonly count: number,
    readonly results: T[]
}
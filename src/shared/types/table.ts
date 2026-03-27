import type { ReactNode } from 'react'

export interface Column<T> {
  id: string
  label: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

export type SortDirection = 'asc' | 'desc'

import type { WheelListParams } from '../types/wheel.types'

export const WHEEL_QUERY_KEYS = {
  all: ['wheels'] as const,
  lists: () => [...WHEEL_QUERY_KEYS.all, 'list'] as const,
  list: (params?: WheelListParams) => [...WHEEL_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...WHEEL_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WHEEL_QUERY_KEYS.details(), id] as const,
} as const

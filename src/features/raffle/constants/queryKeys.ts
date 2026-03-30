import type { RaffleListParams } from '../types/raffle.types'

export const RAFFLE_QUERY_KEYS = {
  all: ['raffles'] as const,
  lists: () => [...RAFFLE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: RaffleListParams) => [...RAFFLE_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...RAFFLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...RAFFLE_QUERY_KEYS.details(), id] as const,
} as const

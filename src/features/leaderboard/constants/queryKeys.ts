import type { LeaderboardListParams } from '../types/leaderboard.types'

export const LEADERBOARD_QUERY_KEYS = {
  all: ['leaderboards'] as const,
  lists: () => [...LEADERBOARD_QUERY_KEYS.all, 'list'] as const,
  list: (params?: LeaderboardListParams) =>
    [...LEADERBOARD_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...LEADERBOARD_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...LEADERBOARD_QUERY_KEYS.details(), id] as const,
} as const

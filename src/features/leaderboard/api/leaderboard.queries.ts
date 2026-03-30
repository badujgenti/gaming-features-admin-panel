import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showSuccess, showError } from '@shared/utils/toast'
import { LEADERBOARD_QUERY_KEYS } from '../constants/queryKeys'
import type { LeaderboardFormData, LeaderboardListParams } from '../types/leaderboard.types'
import {
  getLeaderboards,
  getLeaderboard,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
} from './leaderboard.api'

export function useLeaderboards(params?: LeaderboardListParams) {
  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEYS.list(params),
    queryFn: () => getLeaderboards(params),
  })
}

export function useLeaderboard(id: string) {
  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEYS.detail(id),
    queryFn: () => getLeaderboard(id),
    enabled: !!id,
  })
}

export function useCreateLeaderboard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LeaderboardFormData) => createLeaderboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEYS.lists() })
      showSuccess('Leaderboard created successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useUpdateLeaderboard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeaderboardFormData> }) =>
      updateLeaderboard(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({
        queryKey: LEADERBOARD_QUERY_KEYS.detail(variables.id),
      })
      showSuccess('Leaderboard updated successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useDeleteLeaderboard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLeaderboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEYS.lists() })
      showSuccess('Leaderboard deleted successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

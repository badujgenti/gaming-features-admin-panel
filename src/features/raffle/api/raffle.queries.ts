import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showSuccess, showError } from '@shared/utils/toast'
import { RAFFLE_QUERY_KEYS } from '../constants/queryKeys'
import type { RaffleFormData, RaffleListParams } from '../types/raffle.types'
import { getRaffles, getRaffle, createRaffle, updateRaffle, deleteRaffle } from './raffle.api'

export function useRaffles(params?: RaffleListParams) {
  return useQuery({
    queryKey: RAFFLE_QUERY_KEYS.list(params),
    queryFn: () => getRaffles(params),
  })
}

export function useRaffle(id: string) {
  return useQuery({
    queryKey: RAFFLE_QUERY_KEYS.detail(id),
    queryFn: () => getRaffle(id),
    enabled: !!id,
  })
}

export function useCreateRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RaffleFormData) => createRaffle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_QUERY_KEYS.lists() })
      showSuccess('Raffle created successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useUpdateRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RaffleFormData> }) =>
      updateRaffle(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: RAFFLE_QUERY_KEYS.detail(variables.id) })
      showSuccess('Raffle updated successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useDeleteRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRaffle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_QUERY_KEYS.lists() })
      showSuccess('Raffle deleted successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

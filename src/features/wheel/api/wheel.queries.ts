import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { showSuccess, showError } from '@shared/utils/toast'
import { WHEEL_QUERY_KEYS } from '../constants/queryKeys'
import type { WheelFormData, WheelListParams } from '../types/wheel.types'
import { getWheels, getWheel, createWheel, updateWheel, deleteWheel } from './wheel.api'

export function useWheels(params?: WheelListParams) {
  return useQuery({
    queryKey: WHEEL_QUERY_KEYS.list(params),
    queryFn: () => getWheels(params),
  })
}

export function useWheel(id: string) {
  return useQuery({
    queryKey: WHEEL_QUERY_KEYS.detail(id),
    queryFn: () => getWheel(id),
    enabled: !!id,
  })
}

export function useCreateWheel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: WheelFormData) => createWheel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHEEL_QUERY_KEYS.lists() })
      showSuccess('Wheel created successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useUpdateWheel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WheelFormData> }) =>
      updateWheel(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: WHEEL_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: WHEEL_QUERY_KEYS.detail(variables.id) })
      showSuccess('Wheel updated successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

export function useDeleteWheel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWheel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHEEL_QUERY_KEYS.lists() })
      showSuccess('Wheel deleted successfully')
    },
    onError: (error: Error) => {
      showError(error.message)
    },
  })
}

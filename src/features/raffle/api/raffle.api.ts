import { apiClient } from '@shared/api'
import type {
  Raffle,
  RaffleFormData,
  RaffleListParams,
  RaffleListResponse,
} from '../types/raffle.types'

export async function getRaffles(params?: RaffleListParams): Promise<RaffleListResponse> {
  const response = await apiClient.get<Raffle[]>('/raffles', { params })
  const total = Number(response.headers['x-total-count']) || response.data.length
  return { data: response.data, total }
}

export async function getRaffle(id: string): Promise<Raffle> {
  const response = await apiClient.get<Raffle>(`/raffles/${id}`)
  return response.data
}

export async function createRaffle(data: RaffleFormData): Promise<Raffle> {
  const now = new Date().toISOString()
  const response = await apiClient.post<Raffle>('/raffles', {
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return response.data
}

export async function updateRaffle(id: string, data: Partial<RaffleFormData>): Promise<Raffle> {
  const response = await apiClient.patch<Raffle>(`/raffles/${id}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function deleteRaffle(id: string): Promise<void> {
  await apiClient.delete(`/raffles/${id}`)
}

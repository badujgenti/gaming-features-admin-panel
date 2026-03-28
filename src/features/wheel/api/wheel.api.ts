import { apiClient } from '@shared/api'
import type {
  Wheel,
  WheelFormData,
  WheelListParams,
  WheelListResponse,
} from '../types/wheel.types'

export async function getWheels(params?: WheelListParams): Promise<WheelListResponse> {
  const response = await apiClient.get<Wheel[]>('/wheels', { params })
  const total = Number(response.headers['x-total-count']) || response.data.length
  return { data: response.data, total }
}

export async function getWheel(id: string): Promise<Wheel> {
  const response = await apiClient.get<Wheel>(`/wheels/${id}`)
  return response.data
}

export async function createWheel(data: WheelFormData): Promise<Wheel> {
  const now = new Date().toISOString()
  const response = await apiClient.post<Wheel>('/wheels', {
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return response.data
}

export async function updateWheel(id: string, data: Partial<WheelFormData>): Promise<Wheel> {
  const response = await apiClient.patch<Wheel>(`/wheels/${id}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function deleteWheel(id: string): Promise<void> {
  await apiClient.delete(`/wheels/${id}`)
}

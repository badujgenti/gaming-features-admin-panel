import { apiClient } from '@shared/api'
import type {
  Leaderboard,
  LeaderboardFormData,
  LeaderboardListParams,
  LeaderboardListResponse,
} from '../types/leaderboard.types'

export async function getLeaderboards(
  params?: LeaderboardListParams,
): Promise<LeaderboardListResponse> {
  const response = await apiClient.get<Leaderboard[]>('/leaderboards', { params })
  const total = Number(response.headers['x-total-count']) || response.data.length
  return { data: response.data, total }
}

export async function getLeaderboard(id: string): Promise<Leaderboard> {
  const response = await apiClient.get<Leaderboard>(`/leaderboards/${id}`)
  return response.data
}

export async function createLeaderboard(data: LeaderboardFormData): Promise<Leaderboard> {
  const now = new Date().toISOString()
  const response = await apiClient.post<Leaderboard>('/leaderboards', {
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return response.data
}

export async function updateLeaderboard(
  id: string,
  data: Partial<LeaderboardFormData>,
): Promise<Leaderboard> {
  const response = await apiClient.patch<Leaderboard>(`/leaderboards/${id}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function deleteLeaderboard(id: string): Promise<void> {
  await apiClient.delete(`/leaderboards/${id}`)
}

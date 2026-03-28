export type LeaderboardStatus = 'draft' | 'active' | 'completed'

export type LeaderboardScoringType = 'points' | 'wins' | 'wagered'

export type PrizeType = 'coins' | 'freeSpin' | 'bonus'

export interface LeaderboardPrize {
  id: string
  rank: number
  name: string
  type: PrizeType
  amount: number
  imageUrl: string
}

export interface Leaderboard {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: LeaderboardStatus
  scoringType: LeaderboardScoringType
  prizes: LeaderboardPrize[]
  maxParticipants: number
  createdAt: string
  updatedAt: string
}

export type LeaderboardFormData = Omit<Leaderboard, 'id' | 'createdAt' | 'updatedAt'>

export interface LeaderboardFilters {
  status?: LeaderboardStatus
  scoringType?: LeaderboardScoringType
  q?: string
}

export interface LeaderboardListParams extends LeaderboardFilters {
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
}

export interface LeaderboardListResponse {
  data: Leaderboard[]
  total: number
}

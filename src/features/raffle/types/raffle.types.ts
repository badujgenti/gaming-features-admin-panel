export type RaffleStatus = 'draft' | 'active' | 'drawn' | 'cancelled'

export type RafflePrizeType = 'coins' | 'freeSpin' | 'bonus'

export interface RafflePrize {
  id: string
  name: string
  type: RafflePrizeType
  amount: number
  quantity: number
  imageUrl: string
}

export interface Raffle {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  drawDate: string
  status: RaffleStatus
  ticketPrice: number
  maxTicketsPerUser: number
  prizes: RafflePrize[]
  totalTicketLimit: number | null
  createdAt: string
  updatedAt: string
}

export type RaffleFormData = Omit<Raffle, 'id' | 'createdAt' | 'updatedAt'>

export interface RaffleFilters {
  status?: RaffleStatus
  q?: string
}

export interface RaffleListParams extends RaffleFilters {
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
}

export interface RaffleListResponse {
  data: Raffle[]
  total: number
}

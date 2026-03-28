export type WheelStatus = 'draft' | 'active' | 'inactive'

export type WheelPrizeType = 'coins' | 'freeSpin' | 'bonus' | 'nothing'

export interface WheelSegment {
  id: string
  label: string
  color: string
  weight: number
  prizeType: WheelPrizeType
  prizeAmount: number
  imageUrl: string
}

export interface Wheel {
  id: string
  name: string
  description: string
  status: WheelStatus
  segments: WheelSegment[]
  maxSpinsPerUser: number
  spinCost: number
  backgroundColor: string
  borderColor: string
  createdAt: string
  updatedAt: string
}

export type WheelFormData = Omit<Wheel, 'id' | 'createdAt' | 'updatedAt'>

export interface WheelFilters {
  status?: WheelStatus
  q?: string
}

export interface WheelListParams extends WheelFilters {
  _page?: number
  _limit?: number
  _sort?: string
  _order?: 'asc' | 'desc'
}

export interface WheelListResponse {
  data: Wheel[]
  total: number
}

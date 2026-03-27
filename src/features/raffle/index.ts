import type { RouteObject } from 'react-router-dom'
import { RAFFLE_ROUTES } from './constants/routes'
import { RaffleListPage } from './pages/RaffleListPage'
import { RaffleCreatePage } from './pages/RaffleCreatePage'
import { RaffleEditPage } from './pages/RaffleEditPage'
import { RaffleDetailPage } from './pages/RaffleDetailPage'

export { RAFFLE_ROUTES } from './constants/routes'

export const raffleRoutes: RouteObject[] = [
  { path: RAFFLE_ROUTES.LIST, Component: RaffleListPage },
  { path: RAFFLE_ROUTES.CREATE, Component: RaffleCreatePage },
  { path: RAFFLE_ROUTES.EDIT, Component: RaffleEditPage },
  { path: RAFFLE_ROUTES.DETAIL, Component: RaffleDetailPage },
]

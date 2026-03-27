import type { RouteObject } from 'react-router-dom'
import { LEADERBOARD_ROUTES } from './constants/routes'
import { LeaderboardListPage } from './pages/LeaderboardListPage'
import { LeaderboardCreatePage } from './pages/LeaderboardCreatePage'
import { LeaderboardEditPage } from './pages/LeaderboardEditPage'
import { LeaderboardDetailPage } from './pages/LeaderboardDetailPage'

export { LEADERBOARD_ROUTES } from './constants/routes'

export const leaderboardRoutes: RouteObject[] = [
  { path: LEADERBOARD_ROUTES.LIST, Component: LeaderboardListPage },
  { path: LEADERBOARD_ROUTES.CREATE, Component: LeaderboardCreatePage },
  { path: LEADERBOARD_ROUTES.EDIT, Component: LeaderboardEditPage },
  { path: LEADERBOARD_ROUTES.DETAIL, Component: LeaderboardDetailPage },
]

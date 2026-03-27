import type { RouteObject } from 'react-router-dom'
import { WHEEL_ROUTES } from './constants/routes'
import { WheelListPage } from './pages/WheelListPage'
import { WheelCreatePage } from './pages/WheelCreatePage'
import { WheelEditPage } from './pages/WheelEditPage'
import { WheelDetailPage } from './pages/WheelDetailPage'

export { WHEEL_ROUTES } from './constants/routes'

export const wheelRoutes: RouteObject[] = [
  { path: WHEEL_ROUTES.LIST, Component: WheelListPage },
  { path: WHEEL_ROUTES.CREATE, Component: WheelCreatePage },
  { path: WHEEL_ROUTES.EDIT, Component: WheelEditPage },
  { path: WHEEL_ROUTES.DETAIL, Component: WheelDetailPage },
]

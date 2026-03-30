import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { FeatureBoundary } from './layout/FeatureBoundary'
import { NotFoundPage } from './pages/NotFoundPage'
import { leaderboardRoutes } from '@features/leaderboard'
import { raffleRoutes } from '@features/raffle'
import { wheelRoutes } from '@features/wheel'

function stripPrefix(prefix: string, routes: RouteObject[]): RouteObject[] {
  return routes.map((route): RouteObject => {
    const stripped = (route.path?.replace(prefix, '') || '').replace(/^\//, '')
    if (stripped === '') {
      return { index: true, Component: route.Component, element: route.element }
    }
    return { ...route, path: stripped }
  })
}

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, element: <Navigate to="/leaderboards" replace /> },
      {
        path: 'leaderboards',
        element: <FeatureBoundary name="Leaderboards" />,
        children: stripPrefix('/leaderboards', leaderboardRoutes),
      },
      {
        path: 'raffles',
        element: <FeatureBoundary name="Raffles" />,
        children: stripPrefix('/raffles', raffleRoutes),
      },
      {
        path: 'wheels',
        element: <FeatureBoundary name="Wheels" />,
        children: stripPrefix('/wheels', wheelRoutes),
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]

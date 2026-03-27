import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useLocation, Link as RouterLink } from 'react-router-dom'

const labelMap: Record<string, string> = {
  leaderboards: 'Leaderboards',
  raffles: 'Raffles',
  wheels: 'Wheels',
  create: 'Create',
  edit: 'Edit',
}

export function AppBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <Breadcrumbs>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = labelMap[segment] ?? segment

        if (isLast) {
          return (
            <Typography key={path} color="text.primary" fontWeight={500}>
              {label}
            </Typography>
          )
        }

        return (
          <Link key={path} component={RouterLink} to={path} underline="hover" color="inherit">
            {label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

import { AppBar, Toolbar } from '@mui/material'
import { SIDEBAR_WIDTH } from './Sidebar'
import { AppBreadcrumbs } from './Breadcrumbs'

export function TopBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <AppBreadcrumbs />
      </Toolbar>
    </AppBar>
  )
}

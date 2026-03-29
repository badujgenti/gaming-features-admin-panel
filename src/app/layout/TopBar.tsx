import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { SIDEBAR_WIDTH } from './Sidebar'
import { AppBreadcrumbs } from './Breadcrumbs'
import { useColorMode } from '../hooks/useColorMode'

export function TopBar() {
  const { mode, toggleColorMode } = useColorMode()

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
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleColorMode} color="inherit" title="Toggle dark mode">
          {mode === 'light' ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

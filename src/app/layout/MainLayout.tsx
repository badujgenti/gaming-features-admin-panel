import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar'
import { TopBar } from './TopBar'

export function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minWidth: 1024 }}>
      <Sidebar />
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material'
import { EmojiEvents, ConfirmationNumber, AutoAwesome } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

export const SIDEBAR_WIDTH = 240

const navItems = [
  { label: 'Leaderboards', path: '/leaderboards', icon: <EmojiEvents /> },
  { label: 'Raffles', path: '/raffles', icon: <ConfirmationNumber /> },
  { label: 'Wheels', path: '/wheels', icon: <AutoAwesome /> },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" noWrap fontWeight={700}>
            Gaming Admin
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

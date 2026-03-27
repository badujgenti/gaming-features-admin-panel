import { Box, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import type { SvgIconComponent } from '@mui/icons-material'

interface EmptyStateProps {
  message: string
  icon?: SvgIconComponent
}

export function EmptyState({ message, icon: Icon = InboxIcon }: EmptyStateProps) {
  return (
    <Box sx={{ p: 6, textAlign: 'center' }}>
      <Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}

import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {action && <Box>{action}</Box>}
    </Box>
  )
}

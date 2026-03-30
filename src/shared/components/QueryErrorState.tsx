import { Box, Button, Typography } from '@mui/material'
import { Refresh } from '@mui/icons-material'

interface QueryErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function QueryErrorState({
  message = 'Failed to load data. Please try again.',
  onRetry,
}: QueryErrorStateProps) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  )
}

import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'text.secondary' }}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  )
}

import { Box, Skeleton } from '@mui/material'

interface LoadingSkeletonProps {
  rows?: number
  height?: number
}

export function LoadingSkeleton({ rows = 5, height = 40 }: LoadingSkeletonProps) {
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={height} sx={{ mb: 1, borderRadius: 1 }} />
      ))}
    </Box>
  )
}

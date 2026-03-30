import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { PageHeader, LoadingSkeleton, QueryErrorState } from '@shared/components'
import { formatDateTime } from '@shared/utils'
import { useLeaderboard, useUpdateLeaderboard } from '../api/leaderboard.queries'
import { LEADERBOARD_ROUTES } from '../constants/routes'
import { LeaderboardForm } from '../components/LeaderboardForm'
import type { LeaderboardFormValues } from '../schemas/leaderboard.schema'

export function LeaderboardEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: leaderboard, isLoading, isError, error, refetch } = useLeaderboard(id!)
  const updateMutation = useUpdateLeaderboard()

  const handleSubmit = (data: LeaderboardFormValues) => {
    updateMutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate(LEADERBOARD_ROUTES.DETAIL.replace(':id', id!)) },
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Leaderboard" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Edit Leaderboard" />
        <QueryErrorState message={error?.message} onRetry={() => refetch()} />
      </>
    )
  }

  if (!leaderboard) {
    return <Typography>Leaderboard not found</Typography>
  }

  return (
    <>
      <PageHeader title="Edit Leaderboard" />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ID: {leaderboard.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created: {formatDateTime(leaderboard.createdAt)}
        </Typography>
      </Box>
      <LeaderboardForm
        defaultValues={{
          title: leaderboard.title,
          description: leaderboard.description,
          startDate: leaderboard.startDate,
          endDate: leaderboard.endDate,
          status: leaderboard.status,
          scoringType: leaderboard.scoringType,
          prizes: leaderboard.prizes,
          maxParticipants: leaderboard.maxParticipants,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Leaderboard"
      />
    </>
  )
}

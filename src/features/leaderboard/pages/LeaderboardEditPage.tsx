import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { PageHeader, LoadingSkeleton } from '@shared/components'
import { useLeaderboard, useUpdateLeaderboard } from '../api/leaderboard.queries'
import { LeaderboardForm } from '../components/LeaderboardForm'
import type { LeaderboardFormValues } from '../schemas/leaderboard.schema'

export function LeaderboardEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: leaderboard, isLoading } = useLeaderboard(id!)
  const updateMutation = useUpdateLeaderboard()

  const handleSubmit = (data: LeaderboardFormValues) => {
    updateMutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate(`/leaderboards/${id}`) },
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
          Created: {new Date(leaderboard.createdAt).toLocaleString()}
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

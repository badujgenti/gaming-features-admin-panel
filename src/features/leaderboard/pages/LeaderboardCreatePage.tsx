import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/components'
import { useCreateLeaderboard } from '../api/leaderboard.queries'
import { LEADERBOARD_ROUTES } from '../constants/routes'
import { LeaderboardForm } from '../components/LeaderboardForm'
import type { LeaderboardFormValues } from '../schemas/leaderboard.schema'

export function LeaderboardCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateLeaderboard()

  const handleSubmit = (data: LeaderboardFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(LEADERBOARD_ROUTES.LIST),
    })
  }

  return (
    <>
      <PageHeader title="Create Leaderboard" />
      <LeaderboardForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Leaderboard"
      />
    </>
  )
}

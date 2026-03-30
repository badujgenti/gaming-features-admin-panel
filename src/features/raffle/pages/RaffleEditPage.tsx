import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { PageHeader, LoadingSkeleton, QueryErrorState } from '@shared/components'
import { formatDateTime } from '@shared/utils'
import { useRaffle, useUpdateRaffle } from '../api/raffle.queries'
import { RAFFLE_ROUTES } from '../constants/routes'
import { RaffleForm } from '../components/RaffleForm'
import type { RaffleFormValues } from '../schemas/raffle.schema'

export function RaffleEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: raffle, isLoading, isError, error, refetch } = useRaffle(id!)
  const updateMutation = useUpdateRaffle()

  const handleSubmit = (data: RaffleFormValues) => {
    updateMutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate(RAFFLE_ROUTES.DETAIL.replace(':id', id!)) },
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Raffle" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Edit Raffle" />
        <QueryErrorState message={error?.message} onRetry={() => refetch()} />
      </>
    )
  }

  if (!raffle) {
    return <Typography>Raffle not found</Typography>
  }

  const isDrawn = raffle.status === 'drawn'

  return (
    <>
      <PageHeader title="Edit Raffle" />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ID: {raffle.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created: {formatDateTime(raffle.createdAt)}
        </Typography>
      </Box>
      <RaffleForm
        defaultValues={{
          name: raffle.name,
          description: raffle.description,
          startDate: raffle.startDate,
          endDate: raffle.endDate,
          drawDate: raffle.drawDate,
          status: raffle.status,
          ticketPrice: raffle.ticketPrice,
          maxTicketsPerUser: raffle.maxTicketsPerUser,
          prizes: raffle.prizes,
          totalTicketLimit: raffle.totalTicketLimit,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Raffle"
        disabled={isDrawn}
      />
    </>
  )
}

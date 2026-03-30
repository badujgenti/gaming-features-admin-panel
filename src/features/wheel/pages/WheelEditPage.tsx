import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { PageHeader, LoadingSkeleton, QueryErrorState } from '@shared/components'
import { formatDateTime } from '@shared/utils'
import { useWheel, useUpdateWheel } from '../api/wheel.queries'
import { WHEEL_ROUTES } from '../constants/routes'
import { WheelForm } from '../components/WheelForm'
import type { WheelFormValues } from '../schemas/wheel.schema'

export function WheelEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: wheel, isLoading, isError, error, refetch } = useWheel(id!)
  const updateMutation = useUpdateWheel()

  const handleSubmit = (data: WheelFormValues) => {
    updateMutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate(WHEEL_ROUTES.DETAIL.replace(':id', id!)) },
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Wheel" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Edit Wheel" />
        <QueryErrorState message={error?.message} onRetry={() => refetch()} />
      </>
    )
  }

  if (!wheel) {
    return <Typography>Wheel not found</Typography>
  }

  return (
    <>
      <PageHeader title="Edit Wheel" />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ID: {wheel.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created: {formatDateTime(wheel.createdAt)}
        </Typography>
      </Box>
      <WheelForm
        defaultValues={{
          name: wheel.name,
          description: wheel.description,
          status: wheel.status,
          segments: wheel.segments,
          maxSpinsPerUser: wheel.maxSpinsPerUser,
          spinCost: wheel.spinCost,
          backgroundColor: wheel.backgroundColor,
          borderColor: wheel.borderColor,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Wheel"
      />
    </>
  )
}

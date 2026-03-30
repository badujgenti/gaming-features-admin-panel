import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/components'
import { useCreateRaffle } from '../api/raffle.queries'
import { RAFFLE_ROUTES } from '../constants/routes'
import { RaffleForm } from '../components/RaffleForm'
import type { RaffleFormValues } from '../schemas/raffle.schema'

export function RaffleCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateRaffle()

  const handleSubmit = (data: RaffleFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(RAFFLE_ROUTES.LIST),
    })
  }

  return (
    <>
      <PageHeader title="Create Raffle" />
      <RaffleForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Raffle"
      />
    </>
  )
}

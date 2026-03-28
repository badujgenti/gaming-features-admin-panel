import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/components'
import { useCreateWheel } from '../api/wheel.queries'
import { WHEEL_ROUTES } from '../constants/routes'
import { WheelForm } from '../components/WheelForm'
import type { WheelFormValues } from '../schemas/wheel.schema'

export function WheelCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateWheel()

  const handleSubmit = (data: WheelFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(WHEEL_ROUTES.LIST),
    })
  }

  return (
    <>
      <PageHeader title="Create Wheel" />
      <WheelForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Wheel"
      />
    </>
  )
}

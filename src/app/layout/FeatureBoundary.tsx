import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@shared/components/ErrorBoundary'

export function FeatureBoundary({ name }: { name: string }) {
  return (
    <ErrorBoundary featureName={name}>
      <Outlet />
    </ErrorBoundary>
  )
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useUnsavedChanges } from '@shared/hooks/useUnsavedChanges'

interface UnsavedChangesGuardProps {
  isDirty: boolean
}

export function UnsavedChangesGuard({ isDirty }: UnsavedChangesGuardProps) {
  const blocker = useUnsavedChanges(isDirty)

  if (blocker.state !== 'blocked') {
    return null
  }

  return (
    <Dialog open onClose={() => blocker.reset()} maxWidth="xs" fullWidth>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Are you sure you want to leave?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset()}>Stay</Button>
        <Button onClick={() => blocker.proceed()} color="error" variant="contained">
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  )
}

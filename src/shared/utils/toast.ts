import { enqueueSnackbar } from 'notistack'

export function showSuccess(message: string) {
  enqueueSnackbar(message, { variant: 'success' })
}

export function showError(message: string) {
  enqueueSnackbar(message, { variant: 'error' })
}

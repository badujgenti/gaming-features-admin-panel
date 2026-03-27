import { useCallback, useState } from 'react'

export function useConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null)

  const openDialog = useCallback((onConfirm: () => void) => {
    setOnConfirmCallback(() => onConfirm)
    setOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
    setOnConfirmCallback(null)
  }, [])

  const confirm = useCallback(() => {
    onConfirmCallback?.()
    closeDialog()
  }, [onConfirmCallback, closeDialog])

  return { open, openDialog, closeDialog, confirm }
}

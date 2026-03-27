import { Chip, type ChipProps } from '@mui/material'

const statusColorMap: Record<string, ChipProps['color']> = {
  draft: 'default',
  active: 'success',
  completed: 'info',
  drawn: 'info',
  cancelled: 'error',
  inactive: 'error',
}

interface StatusChipProps {
  status: string
}

export function StatusChip({ status }: StatusChipProps) {
  const color = statusColorMap[status.toLowerCase()] ?? 'default'

  return <Chip label={status} color={color} size="small" />
}

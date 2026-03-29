import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, ToggleButton, ToggleButtonGroup, Box } from '@mui/material'
import { Add, Visibility, Edit, Delete } from '@mui/icons-material'
import { PageHeader, DataTable, StatusChip, ConfirmDialog } from '@shared/components'
import { useConfirmDialog } from '@shared/hooks'
import type { Column, SortDirection } from '@shared/types/table'
import { useWheels, useDeleteWheel } from '../api/wheel.queries'
import { WHEEL_ROUTES } from '../constants/routes'
import type { Wheel, WheelStatus } from '../types/wheel.types'
import { useQueryClient } from '@tanstack/react-query'
import { WHEEL_QUERY_KEYS } from '../constants/queryKeys'

const columns: Column<Wheel>[] = [
  { id: 'name', label: 'Name', sortable: true },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
  {
    id: 'segments',
    label: 'Segments',
    render: (row) => String(row.segments.length),
  },
  { id: 'spinCost', label: 'Spin Cost', sortable: true },
  { id: 'maxSpinsPerUser', label: 'Max Spins', sortable: true },
]

type StatusFilter = 'all' | WheelStatus

export function WheelListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { open, openDialog, closeDialog, confirm } = useConfirmDialog()
  const deleteMutation = useDeleteWheel()

  const { data, isLoading } = useWheels({
    _page: page + 1,
    _limit: rowsPerPage,
    _sort: sortBy,
    _order: sortDirection,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  })

  const handleSortChange = (columnId: string) => {
    if (sortBy === columnId) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(columnId)
      setSortDirection('asc')
    }
  }

  const queryClient = useQueryClient()

  const handleReorder = useCallback(
    (activeId: string, overId: string) => {
      const wheels = data?.data ?? []
      const oldIndex = wheels.findIndex((w) => w.id === activeId)
      const newIndex = wheels.findIndex((w) => w.id === overId)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = [...wheels]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      queryClient.setQueryData(
        WHEEL_QUERY_KEYS.list({
          _page: page + 1,
          _limit: rowsPerPage,
          _sort: sortBy,
          _order: sortDirection,
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        }),
        { data: reordered, total: data?.total ?? 0 },
      )
    },
    [data, page, rowsPerPage, sortBy, sortDirection, statusFilter, queryClient],
  )

  const handleDelete = (id: string) => {
    openDialog(() => deleteMutation.mutate(id))
  }

  return (
    <>
      <PageHeader
        title="Wheels"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(WHEEL_ROUTES.CREATE)}
          >
            Create Wheel
          </Button>
        }
      />

      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, value: StatusFilter | null) => {
            if (value !== null) {
              setStatusFilter(value)
              setPage(0)
            }
          }}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="draft">Draft</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="inactive">Inactive</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <DataTable<Wheel>
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        totalCount={data?.total ?? 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp)
          setPage(0)
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        emptyStateMessage="No wheels found"
        rowId={(row) => row.id}
        onReorder={handleReorder}
        actions={(row) => (
          <>
            <IconButton
              size="small"
              onClick={() => navigate(`/wheels/${row.id}`)}
              title="View"
            >
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => navigate(`/wheels/${row.id}/edit`)}
              title="Edit"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.id)}
              title="Delete"
            >
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
      />

      <ConfirmDialog
        open={open}
        title="Delete Wheel"
        message="Are you sure you want to delete this wheel? This action cannot be undone."
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  )
}

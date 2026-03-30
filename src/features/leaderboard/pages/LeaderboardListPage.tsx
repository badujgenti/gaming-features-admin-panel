import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, ToggleButton, ToggleButtonGroup, Box } from '@mui/material'
import { Add, Visibility, Edit, Delete } from '@mui/icons-material'
import { PageHeader, DataTable, StatusChip, ConfirmDialog } from '@shared/components'
import { useConfirmDialog } from '@shared/hooks'
import type { Column, SortDirection } from '@shared/types/table'
import { useLeaderboards, useDeleteLeaderboard } from '../api/leaderboard.queries'
import { LEADERBOARD_ROUTES } from '../constants/routes'
import { LEADERBOARD_QUERY_KEYS } from '../constants/queryKeys'
import type { Leaderboard, LeaderboardStatus } from '../types/leaderboard.types'
import { formatDate } from '@shared/utils'
import { useQueryClient } from '@tanstack/react-query'

const columns: Column<Leaderboard>[] = [
  { id: 'title', label: 'Title', sortable: true },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
  { id: 'scoringType', label: 'Scoring', sortable: true },
  {
    id: 'startDate',
    label: 'Start Date',
    sortable: true,
    render: (row) => formatDate(row.startDate),
  },
  {
    id: 'endDate',
    label: 'End Date',
    sortable: true,
    render: (row) => formatDate(row.endDate),
  },
  { id: 'maxParticipants', label: 'Max Players', sortable: true },
]

type StatusFilter = 'all' | LeaderboardStatus

export function LeaderboardListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { open, openDialog, closeDialog, confirm } = useConfirmDialog()
  const deleteMutation = useDeleteLeaderboard()

  const { data, isLoading } = useLeaderboards({
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

  const handleReorder = useCallback(
    (activeId: string, overId: string) => {
      const items = data?.data ?? []
      const oldIndex = items.findIndex((item) => item.id === activeId)
      const newIndex = items.findIndex((item) => item.id === overId)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = [...items]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      queryClient.setQueryData(
        LEADERBOARD_QUERY_KEYS.list({
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
        title="Leaderboards"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(LEADERBOARD_ROUTES.CREATE)}
          >
            Create Leaderboard
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
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <DataTable<Leaderboard>
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
        emptyStateMessage="No leaderboards found"
        rowId={(row) => row.id}
        onReorder={handleReorder}
        actions={(row) => (
          <>
            <IconButton
              size="small"
              onClick={() => navigate(LEADERBOARD_ROUTES.DETAIL.replace(':id', row.id))}
              title="View"
            >
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => navigate(LEADERBOARD_ROUTES.EDIT.replace(':id', row.id))}
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
        title="Delete Leaderboard"
        message="Are you sure you want to delete this leaderboard? This action cannot be undone."
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  )
}

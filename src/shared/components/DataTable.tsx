import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Skeleton,
  Typography,
  Box,
} from '@mui/material'
import type { Column, SortDirection } from '@shared/types/table'

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading: boolean
  totalCount: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  sortBy?: string
  sortDirection?: SortDirection
  onSortChange?: (columnId: string) => void
  emptyStateMessage?: string
  actions?: (row: T) => ReactNode
}

export function DataTable<T extends object>({
  columns,
  data,
  loading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  sortBy,
  sortDirection,
  onSortChange,
  emptyStateMessage = 'No data available',
  actions,
}: DataTableProps<T>) {
  const allColumns = actions
    ? [...columns, { id: '_actions', label: 'Actions', sortable: false } as Column<T>]
    : columns

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {allColumns.map((col) => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {allColumns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (data.length === 0) {
    return (
      <Paper>
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyStateMessage}</Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {allColumns.map((col) => (
              <TableCell key={col.id}>
                {col.sortable && onSortChange ? (
                  <TableSortLabel
                    active={sortBy === col.id}
                    direction={sortBy === col.id ? sortDirection : 'asc'}
                    onClick={() => onSortChange(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.id] ?? '')}
                </TableCell>
              ))}
              {actions && <TableCell>{actions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  )
}

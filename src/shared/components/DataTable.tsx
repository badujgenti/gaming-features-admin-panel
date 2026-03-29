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
import { DragIndicator } from '@mui/icons-material'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  rowId?: (row: T) => string
  onReorder?: (activeId: string, overId: string) => void
}

interface SortableRowProps<T> {
  row: T
  rowId: string
  columns: Column<T>[]
  actions?: (row: T) => ReactNode
}

function SortableRow<T extends object>({ row, rowId, columns, actions }: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rowId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style} hover>
      <TableCell sx={{ width: 40, cursor: 'grab', px: 1 }} {...attributes} {...listeners}>
        <DragIndicator fontSize="small" sx={{ color: 'text.secondary' }} />
      </TableCell>
      {columns.map((col) => (
        <TableCell key={col.id}>
          {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.id] ?? '')}
        </TableCell>
      ))}
      {actions && <TableCell>{actions(row)}</TableCell>}
    </TableRow>
  )
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
  rowId,
  onReorder,
}: DataTableProps<T>) {
  const draggable = !!rowId && !!onReorder

  const allColumns = actions
    ? [...columns, { id: '_actions', label: 'Actions', sortable: false } as Column<T>]
    : columns

  const headerColumns = draggable
    ? [{ id: '_drag', label: '', sortable: false } as Column<T>, ...allColumns]
    : allColumns

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id && onReorder) {
      onReorder(String(active.id), String(over.id))
    }
  }

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headerColumns.map((col) => (
                <TableCell key={col.id}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {headerColumns.map((col) => (
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

  const tableBody = draggable ? (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={data.map((row) => rowId(row))}
        strategy={verticalListSortingStrategy}
      >
        <TableBody>
          {data.map((row) => (
            <SortableRow
              key={rowId(row)}
              row={row}
              rowId={rowId(row)}
              columns={columns}
              actions={actions}
            />
          ))}
        </TableBody>
      </SortableContext>
    </DndContext>
  ) : (
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
  )

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {draggable && <TableCell width={40} />}
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
        {tableBody}
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

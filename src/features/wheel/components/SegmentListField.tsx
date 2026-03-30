import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material'
import { Add, Delete, DragIndicator } from '@mui/icons-material'
import { useFieldArray, type Control, type FieldErrors, Controller, useWatch } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
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
import type { WheelFormValues } from '../schemas/wheel.schema'

interface SegmentListFieldProps {
  control: Control<WheelFormValues>
  errors: FieldErrors<WheelFormValues>
}

const PRIZE_TYPES = [
  { value: 'coins', label: 'Coins' },
  { value: 'freeSpin', label: 'Free Spin' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'nothing', label: 'Nothing' },
]

interface SortableRowProps {
  fieldId: string
  index: number
  control: Control<WheelFormValues>
  onRemove: () => void
  canRemove: boolean
}

function SortableRow({ fieldId, index, control, onRemove, canRemove }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fieldId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell sx={{ width: 40, cursor: 'grab', px: 1 }} {...attributes} {...listeners}>
        <DragIndicator fontSize="small" sx={{ color: 'text.secondary' }} />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.label`}
          control={control}
          render={({ field: f, fieldState: { error } }) => (
            <TextField
              {...f}
              size="small"
              fullWidth
              placeholder="Segment label"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.color`}
          control={control}
          render={({ field: f }) => (
            <input
              type="color"
              value={f.value}
              onChange={f.onChange}
              style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.weight`}
          control={control}
          render={({ field: f, fieldState: { error } }) => (
            <TextField
              {...f}
              onChange={(e) => f.onChange(Number(e.target.value))}
              size="small"
              fullWidth
              type="number"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.prizeType`}
          control={control}
          render={({ field: f }) => (
            <TextField {...f} select size="small" fullWidth>
              {PRIZE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.prizeAmount`}
          control={control}
          render={({ field: f, fieldState: { error } }) => (
            <TextField
              {...f}
              onChange={(e) => f.onChange(Number(e.target.value))}
              size="small"
              fullWidth
              type="number"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`segments.${index}.imageUrl`}
          control={control}
          render={({ field: f }) => (
            <TextField {...f} size="small" fullWidth placeholder="https://..." />
          )}
        />
      </TableCell>
      <TableCell>
        <IconButton size="small" color="error" onClick={onRemove} disabled={!canRemove}>
          <Delete fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export function SegmentListField({ control, errors }: SegmentListFieldProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'segments',
  })

  const segments = useWatch({ control, name: 'segments' })
  const totalWeight = (segments ?? []).reduce((sum, s) => sum + (s?.weight ?? 0), 0)
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  const handleAddSegment = () => {
    append({
      id: uuidv4(),
      label: '',
      color: '#607D8B',
      weight: 0,
      prizeType: 'coins',
      prizeAmount: 0,
      imageUrl: '',
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Segments</Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: isWeightValid ? 'success.main' : 'error.main' }}
          >
            Total: {totalWeight}/100
          </Typography>
        </Box>
        <Button
          startIcon={<Add />}
          onClick={handleAddSegment}
          size="small"
          disabled={fields.length >= 12}
        >
          Add Segment
        </Button>
      </Box>

      {fields.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No segments added yet. Add at least 2 segments.
        </Typography>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={40} />
                    <TableCell>Label</TableCell>
                    <TableCell width={80}>Color</TableCell>
                    <TableCell width={90}>Weight</TableCell>
                    <TableCell width={130}>Prize Type</TableCell>
                    <TableCell width={110}>Amount</TableCell>
                    <TableCell>Image URL</TableCell>
                    <TableCell width={50} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <SortableRow
                      key={field.id}
                      fieldId={field.id}
                      index={index}
                      control={control}
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 2}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SortableContext>
        </DndContext>
      )}

      {errors.segments?.root?.message && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.segments.root.message}
        </FormHelperText>
      )}
      {typeof errors.segments?.message === 'string' && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.segments.message}
        </FormHelperText>
      )}
    </Box>
  )
}

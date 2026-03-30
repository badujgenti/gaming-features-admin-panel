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
import { Add, Delete } from '@mui/icons-material'
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  Controller,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import type { LeaderboardFormValues } from '../schemas/leaderboard.schema'

interface PrizeListFieldProps {
  control: Control<LeaderboardFormValues>
  errors: FieldErrors<LeaderboardFormValues>
}

const PRIZE_TYPES = [
  { value: 'coins', label: 'Coins' },
  { value: 'freeSpin', label: 'Free Spin' },
  { value: 'bonus', label: 'Bonus' },
]

export function PrizeListField({ control, errors }: PrizeListFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prizes',
  })

  const handleAddPrize = () => {
    append({
      id: uuidv4(),
      rank: fields.length + 1,
      name: '',
      type: 'coins',
      amount: 0,
      imageUrl: '',
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Prizes</Typography>
        <Button startIcon={<Add />} onClick={handleAddPrize} size="small">
          Add Prize
        </Button>
      </Box>

      {fields.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No prizes added yet. Add at least one prize.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={60}>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell width={140}>Type</TableCell>
                <TableCell width={120}>Amount</TableCell>
                <TableCell>Image URL</TableCell>
                <TableCell width={50} />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      #{index + 1}
                    </Typography>
                    <Controller
                      name={`prizes.${index}.rank`}
                      control={control}
                      render={({ field: rankField }) => {
                        if (rankField.value !== index + 1) {
                          rankField.onChange(index + 1)
                        }
                        return <input type="hidden" {...rankField} />
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`prizes.${index}.name`}
                      control={control}
                      render={({ field: f, fieldState: { error } }) => (
                        <TextField
                          {...f}
                          size="small"
                          fullWidth
                          placeholder="Prize name"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`prizes.${index}.type`}
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
                      name={`prizes.${index}.amount`}
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
                      name={`prizes.${index}.imageUrl`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField {...f} size="small" fullWidth placeholder="https://..." />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => remove(index)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {errors.prizes?.root?.message && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.prizes.root.message}
        </FormHelperText>
      )}
      {typeof errors.prizes?.message === 'string' && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.prizes.message}
        </FormHelperText>
      )}
    </Box>
  )
}

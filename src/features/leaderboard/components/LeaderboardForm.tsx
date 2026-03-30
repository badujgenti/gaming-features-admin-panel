import { Box, Button, Grid, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormTextField, FormSelect, FormDatePicker, UnsavedChangesGuard } from '@shared/components'
import {
  leaderboardFormSchema,
  type LeaderboardFormValues,
} from '../schemas/leaderboard.schema'
import { PrizeListField } from './PrizeListField'

interface LeaderboardFormProps {
  defaultValues?: LeaderboardFormValues
  onSubmit: (data: LeaderboardFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

const INITIAL_VALUES: LeaderboardFormValues = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'draft',
  scoringType: 'points',
  prizes: [],
  maxParticipants: 100,
}

export function LeaderboardForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
}: LeaderboardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardFormSchema),
    defaultValues: defaultValues ?? INITIAL_VALUES,
  })

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty && !isSubmitting} />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormTextField name="title" control={control} label="Title" />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              name="description"
              control={control}
              label="Description"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormDatePicker name="startDate" control={control} label="Start Date" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormDatePicker name="endDate" control={control} label="End Date" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormSelect name="status" control={control} label="Status">
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </FormSelect>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormSelect name="scoringType" control={control} label="Scoring Type">
              <MenuItem value="points">Points</MenuItem>
              <MenuItem value="wins">Wins</MenuItem>
              <MenuItem value="wagered">Wagered</MenuItem>
            </FormSelect>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField
              name="maxParticipants"
              control={control}
              label="Max Participants"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <PrizeListField control={control} errors={errors} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

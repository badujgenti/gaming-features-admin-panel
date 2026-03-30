import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Alert } from '@mui/material'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormTextField, FormSelect, FormDatePicker, UnsavedChangesGuard } from '@shared/components'
import { raffleFormSchema, type RaffleFormValues } from '../schemas/raffle.schema'
import { RafflePrizeField } from './RafflePrizeField'

interface RaffleFormProps {
  defaultValues?: RaffleFormValues
  onSubmit: (data: RaffleFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
  disabled?: boolean
}

const INITIAL_VALUES: RaffleFormValues = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  drawDate: '',
  status: 'draft',
  ticketPrice: 0,
  maxTicketsPerUser: 1,
  prizes: [],
  totalTicketLimit: null,
}

export function RaffleForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  disabled = false,
}: RaffleFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleFormSchema),
    defaultValues: defaultValues ?? INITIAL_VALUES,
  })

  const totalTicketLimit = useWatch({ control, name: 'totalTicketLimit' })
  const isUnlimited = totalTicketLimit === null

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty && !isSubmitting} />

      {disabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Drawn raffles cannot be edited
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormTextField name="name" control={control} label="Name" disabled={disabled} />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              name="description"
              control={control}
              label="Description"
              multiline
              rows={3}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormDatePicker name="startDate" control={control} label="Start Date" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormDatePicker name="endDate" control={control} label="End Date" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormDatePicker name="drawDate" control={control} label="Draw Date" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormSelect name="status" control={control} label="Status" disabled={disabled}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="drawn">Drawn</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </FormSelect>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField
              name="ticketPrice"
              control={control}
              label="Ticket Price"
              type="number"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField
              name="maxTicketsPerUser"
              control={control}
              label="Max Tickets Per User"
              type="number"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isUnlimited}
                  onChange={(e) => {
                    setValue('totalTicketLimit', e.target.checked ? null : 100, {
                      shouldDirty: true,
                    })
                  }}
                  disabled={disabled}
                />
              }
              label="Unlimited tickets"
            />
          </Grid>
          {!isUnlimited && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="totalTicketLimit"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormTextField
                    name="totalTicketLimit"
                    control={control}
                    label="Total Ticket Limit"
                    type="number"
                    error={!!error}
                    helperText={error?.message}
                    disabled={disabled}
                    value={field.value ?? ''}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <RafflePrizeField control={control} errors={errors} disabled={disabled} />
          </Grid>
          {!disabled && (
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  )
}

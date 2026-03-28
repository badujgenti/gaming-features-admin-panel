import { Box, Button, Grid, MenuItem } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormTextField,
  FormSelect,
  FormColorPicker,
  UnsavedChangesGuard,
} from '@shared/components'
import { wheelFormSchema, type WheelFormValues } from '../schemas/wheel.schema'
import { SegmentListField } from './SegmentListField'
import { WheelPreview } from './WheelPreview'

interface WheelFormProps {
  defaultValues?: WheelFormValues
  onSubmit: (data: WheelFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

const INITIAL_VALUES: WheelFormValues = {
  name: '',
  description: '',
  status: 'draft',
  segments: [],
  maxSpinsPerUser: 1,
  spinCost: 0,
  backgroundColor: '#FFFFFF',
  borderColor: '#333333',
}

export function WheelForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
}: WheelFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WheelFormValues>({
    resolver: zodResolver(wheelFormSchema),
    defaultValues: defaultValues ?? INITIAL_VALUES,
  })

  const segments = useWatch({ control, name: 'segments' })

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty && !isSubmitting} />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormTextField name="name" control={control} label="Name" />
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
              <Grid item xs={12} sm={4}>
                <FormSelect name="status" control={control} label="Status">
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </FormSelect>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormTextField
                  name="maxSpinsPerUser"
                  control={control}
                  label="Max Spins Per User"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormTextField
                  name="spinCost"
                  control={control}
                  label="Spin Cost"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormColorPicker
                  name="backgroundColor"
                  control={control}
                  label="Background Color"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormColorPicker name="borderColor" control={control} label="Border Color" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'sticky',
                top: 100,
              }}
            >
              <WheelPreview segments={segments ?? []} size={280} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <SegmentListField control={control} errors={errors} />
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

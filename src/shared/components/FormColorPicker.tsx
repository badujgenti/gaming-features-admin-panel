import { Box, TextField } from '@mui/material'
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form'

interface FormColorPickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
}

export function FormColorPicker<T extends FieldValues>({
  name,
  control,
  label,
}: FormColorPickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: field.value as string,
              flexShrink: 0,
            }}
          />
          <TextField
            {...field}
            label={label}
            placeholder="#000000"
            error={!!error}
            helperText={error?.message}
            fullWidth
          />
        </Box>
      )}
    />
  )
}

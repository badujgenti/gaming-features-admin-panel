import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form'

interface FormDatePickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
}

export function FormDatePicker<T extends FieldValues>({
  name,
  control,
  label,
}: FormDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value ?? null}
          onChange={(date) => field.onChange(date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  )
}

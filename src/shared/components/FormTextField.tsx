import { TextField, type TextFieldProps } from '@mui/material'
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form'

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
} & Omit<TextFieldProps, 'name'>

export function FormTextField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          onChange={(e) => {
            const value = e.target.value
            field.onChange(textFieldProps.type === 'number' ? (value === '' ? '' : Number(value)) : value)
          }}
          error={!!error}
          helperText={error?.message ?? textFieldProps.helperText}
          fullWidth
        />
      )}
    />
  )
}

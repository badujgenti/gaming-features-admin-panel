import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  type SelectProps,
} from '@mui/material'
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form'

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label: string
  children: React.ReactNode
} & Omit<SelectProps, 'name'>

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  children,
  ...selectProps
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select {...field} {...selectProps} label={label}>
            {children}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

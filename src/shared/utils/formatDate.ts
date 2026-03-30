const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTIONS,
  hour: '2-digit',
  minute: '2-digit',
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', DATE_OPTIONS)
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', DATETIME_OPTIONS)
}

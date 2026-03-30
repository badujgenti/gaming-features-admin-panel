import { type ReactNode, useState, useMemo, useCallback } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { ColorModeContext } from '../hooks/useColorMode'
import type { ColorMode } from '../hooks/useColorMode'

function getStoredMode(): ColorMode {
  const stored = localStorage.getItem('color-mode')
  return stored === 'dark' ? 'dark' : 'light'
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ColorMode>(getStoredMode)

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('color-mode', next)
      return next
    })
  }, [])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          secondary: { main: '#9c27b0' },
        },
      }),
    [mode],
  )

  const contextValue = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode])

  return (
    <ColorModeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}

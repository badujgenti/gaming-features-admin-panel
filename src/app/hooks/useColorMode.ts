import { createContext, useContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface ColorModeContextValue {
  mode: ColorMode
  toggleColorMode: () => void
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {},
})

export function useColorMode() {
  return useContext(ColorModeContext)
}

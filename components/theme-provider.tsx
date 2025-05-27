'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme="light" enableSystem={false} {...props}>
      <ForceLightTheme />
      {children}
    </NextThemesProvider>
  )
}

function ForceLightTheme() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    // Temani har doim "light" qilib o'rnatish
    setTheme('light')
  }, [setTheme])

  return null
}

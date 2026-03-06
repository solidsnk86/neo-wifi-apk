import { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
})

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme()
  const [theme, setTheme] = useState<Theme>(systemScheme ?? 'dark')

  // Sync with system on first load
  useEffect(() => {
    if (systemScheme) setTheme(systemScheme)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAppTheme() {
  return useContext(ThemeContext)
}

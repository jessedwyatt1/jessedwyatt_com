import { createContext, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type ThemeMode = 'professional' | 'personal'
type ThemeContextType = { mode: ThemeMode }

const ThemeContext = createContext<ThemeContextType>({ mode: 'professional' })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const mode = pathname.startsWith('/personal') ? 'personal' : 'professional'

  return (
    <ThemeContext.Provider value={{ mode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext) 
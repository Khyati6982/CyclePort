import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')
  })

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'

    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
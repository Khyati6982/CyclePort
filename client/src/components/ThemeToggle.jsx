import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const icon = theme === 'dark' ? '🌞' : '🌛'
  const label = theme === 'dark' ? 'Switch to Light Mode 🌞' : 'Switch to Dark Mode 🌛'

  return (
    <div className="relative group">
      {/* Icon Button for Desktop */}
      <button
        onClick={toggleTheme}
        className="hidden md:inline-block text-2xl transition-transform duration-300 hover:scale-110 hover:rotate-6 cursor-pointer"
        aria-label="Toggle theme"
      >
        {icon}
      </button>

      {/* Tooltip */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-[10rem] text-center bg-gray-800 dark:bg-gray-200 text-white dark:text-black">
        Toggle theme
      </span>

      {/* Text Button for Mobile */}
      <button
        onClick={toggleTheme}
        className="md:hidden mt-2 px-3 py-1 rounded bg-[var(--color-teal-500)] text-white hover:bg-[var(--color-teal-600)] text-sm cursor-pointer"
      >
        {label}
      </button>
    </div>
  )
}
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

const STORAGE_KEY = 'avets-estate-theme'

export function ThemeProvider({ children }) {
	const [darkMode, setDarkMode] = useState(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored !== null) {
			return stored === 'dark'
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches
	})

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, darkMode ? 'dark' : 'light')
		if (darkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [darkMode])

	const toggleDarkMode = () => {
		// Add transitioning class so CSS transition fires only during the switch
		document.documentElement.classList.add('theme-transitioning')
		setDarkMode(prev => !prev)
		// Remove after transition completes (matches 300ms in CSS)
		window.setTimeout(() => {
			document.documentElement.classList.remove('theme-transitioning')
		}, 300)
	}

	return (
		<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

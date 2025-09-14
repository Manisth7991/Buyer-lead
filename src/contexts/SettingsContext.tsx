'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Language, type TranslationKey } from '@/lib/translations'

type Theme = 'light' | 'dark' | 'system'

interface SettingsContextType {
    theme: Theme
    language: Language
    setTheme: (theme: Theme) => void
    setLanguage: (language: Language) => void
    actualTheme: 'light' | 'dark' // Computed based on system preference if theme is 'system'
    t: (key: TranslationKey) => string // Translation function
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')
    const [language, setLanguageState] = useState<Language>('english')
    const [mounted, setMounted] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme || 'light'
        const savedLanguage = localStorage.getItem('language') as Language || 'english'

        setThemeState(savedTheme)
        setLanguageState(savedLanguage)
        setMounted(true)
    }, [])

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.remove('light', 'dark')
            root.classList.add(systemTheme)
        } else {
            root.classList.remove('light', 'dark')
            root.classList.add(theme)
        }
    }, [theme, mounted])

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            const root = document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(mediaQuery.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage)
        localStorage.setItem('language', newLanguage)
    }

    // Translation function
    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.english[key] || key
    }

    // Compute actual theme for components that need it
    const getActualTheme = (): 'light' | 'dark' => {
        if (theme === 'system') {
            return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
    }

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <SettingsContext.Provider
            value={{
                theme,
                language,
                setTheme,
                setLanguage,
                actualTheme: getActualTheme(),
                t
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
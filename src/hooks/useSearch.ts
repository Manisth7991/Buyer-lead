'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useSearch() {
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const router = useRouter()

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            if (response.ok) {
                const results = await response.json()
                setSearchResults(results)
            }
        } catch (error) {
            console.error('Search failed:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }, [])

    const navigateToResult = useCallback((result: any) => {
        if (result.type === 'buyer') {
            router.push(`/buyers/${result.id}`)
        }
        setSearchResults([])
    }, [router])

    return {
        search,
        isSearching,
        searchResults,
        navigateToResult,
        clearResults: () => setSearchResults([])
    }
}
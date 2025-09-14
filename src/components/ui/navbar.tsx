'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useSearch } from '@/hooks/useSearch'
import {
    BellIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    PhoneIcon,
    MapPinIcon,
    Bars3Icon
} from '@heroicons/react/24/outline'

interface TopNavbarProps {
    onMenuClick?: () => void
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const { search, isSearching, searchResults, navigateToResult, clearResults } = useSearch()
    const searchRef = useRef<HTMLDivElement>(null)

    // Handle search input
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        if (value.trim()) {
            await search(value)
            setShowSearchResults(true)
        } else {
            clearResults()
            setShowSearchResults(false)
        }
    }

    // Handle clicking outside search to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle selecting a search result
    const handleSelectResult = (result: any) => {
        navigateToResult(result)
        setSearchQuery('')
        setShowSearchResults(false)
    }

    return (
        <motion.header
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 shadow-sm"
        >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Left side - Mobile menu + Search */}
                <div className="flex items-center flex-1 max-w-md">
                    {/* Mobile menu button */}
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    )}

                    <div className="relative w-full" ref={searchRef}>
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search buyers, leads, or properties..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
                        />

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showSearchResults && searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
                                >
                                    {searchResults.map((result: any) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelectResult(result)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {result.title.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {result.title}
                                                    </p>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <div className="flex items-center space-x-1">
                                                            <PhoneIcon className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">{result.phone}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <MapPinIcon className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">{result.city}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{result.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Loading indicator */}
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* No results message */}
                        {showSearchResults && searchQuery && !isSearching && searchResults.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-4 z-50"
                            >
                                <div className="text-center text-gray-500 text-sm">
                                    No results found for &quot;{searchQuery}&quot;
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right side - Actions & User */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    >
                        <BellIcon className="w-6 h-6" />
                    </motion.button>

                    {/* User Menu */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {session?.user?.name || 'Demo User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {session?.user?.email || 'demo@example.com'}
                                </p>
                            </div>
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </motion.button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                            >
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">Signed in as</p>
                                    <p className="text-sm text-gray-600 truncate">
                                        {session?.user?.email || 'demo@example.com'}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            router.push('/profile')
                                            setShowUserMenu(false)
                                        }}
                                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <UserCircleIcon className="w-4 h-4 mr-3" />
                                        Your Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/settings')
                                            setShowUserMenu(false)
                                        }}
                                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                        Settings
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 py-1">
                                    <button
                                        onClick={() => signOut()}
                                        className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
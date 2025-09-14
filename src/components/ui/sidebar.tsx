'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    UsersIcon,
    ArrowUpTrayIcon,
    UserCircleIcon,
    ChartBarIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Buyers', href: '/buyers', icon: UsersIcon },
    { name: 'Import/Export', href: '/buyers/import', icon: ArrowUpTrayIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

interface SidebarProps {
    onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname()

    return (
        <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700"
        >
            {/* Mobile close button */}
            {onClose && (
                <div className="lg:hidden absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lead Manager</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Real Estate CRM</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-3">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href === '/buyers' && pathname.startsWith('/buyers')) ||
                            (item.href === '/dashboard' && pathname === '/dashboard')

                        return (
                            <li key={item.name}>
                                <Link href={item.href} onClick={onClose}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      cursor-pointer group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }
                    `}
                                    >
                                        <item.icon
                                            className={`
                        mr-3 h-5 w-5 transition-colors duration-200
                        ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
                      `}
                                        />
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Demo User</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">demo@example.com</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
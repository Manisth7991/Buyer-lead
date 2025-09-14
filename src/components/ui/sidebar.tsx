'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    UsersIcon,
    ArrowUpTrayIcon,
    UserCircleIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '/buyers', icon: HomeIcon },
    { name: 'Buyers', href: '/buyers', icon: UsersIcon },
    { name: 'Import/Export', href: '/buyers/import', icon: ArrowUpTrayIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200"
        >
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                        <h1 className="text-xl font-bold text-gray-900">Lead Manager</h1>
                        <p className="text-sm text-gray-500">Real Estate CRM</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-3">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href === '/buyers' && pathname.startsWith('/buyers'))

                        return (
                            <li key={item.name}>
                                <Link href={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      cursor-pointer group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }
                    `}
                                    >
                                        <item.icon
                                            className={`
                        mr-3 h-5 w-5 transition-colors duration-200
                        ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
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
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Demo User</p>
                        <p className="text-xs text-gray-500">demo@example.com</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
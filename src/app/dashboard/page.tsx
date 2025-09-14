'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    UserGroupIcon,
    ChartBarIcon,
    PlusIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    EyeIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'

interface DashboardStats {
    totalBuyers: number
    recentBuyers: Array<{
        id: string
        fullName: string
        phone: string
        email: string | null
        status: string
        createdAt: string
        owner: { name: string | null }
    }>
    statusCounts: Record<string, number>
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            redirect('/auth/signin')
            return
        }

        // Fetch dashboard data
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [session, status])

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (!session || !stats) {
        return null
    }

    const activeBuyers = (stats.statusCounts.NEW || 0) + (stats.statusCounts.CONTACTED || 0) + (stats.statusCounts.QUALIFIED || 0) + (stats.statusCounts.VISITED || 0) + (stats.statusCounts.NEGOTIATION || 0)
    const convertedBuyers = stats.statusCounts.CONVERTED || 0

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome back, {session.user?.name?.split(' ')[0]}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Here&apos;s what&apos;s happening with your leads today
                            </p>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            <Link href="/buyers/new">
                                <Button>
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Add New Lead
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <motion.div variants={itemVariants} className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <UserGroupIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBuyers}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Leads</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeBuyers}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <CheckCircleIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Converted</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{convertedBuyers}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <ChartBarIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalBuyers > 0 ? Math.round((convertedBuyers / stats.totalBuyers) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link href="/buyers/new">
                                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50 hover:border-blue-400 transition-all duration-200">
                                        <PlusIcon className="w-5 h-5 mr-3 text-blue-600" />
                                        Add New Lead
                                    </Button>
                                </Link>
                                <Link href="/buyers/import">
                                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50 hover:border-green-400 transition-all duration-200">
                                        <DocumentArrowUpIcon className="w-5 h-5 mr-3 text-green-600" />
                                        Import Leads
                                    </Button>
                                </Link>
                                <Link href="/analytics">
                                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50 hover:border-purple-400 transition-all duration-200">
                                        <ChartBarIcon className="w-5 h-5 mr-3 text-purple-600" />
                                        View Analytics
                                    </Button>
                                </Link>
                                <Link href="/buyers">
                                    <Button variant="outline" className="w-full justify-start border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200">
                                        <EyeIcon className="w-5 h-5 mr-3 text-gray-600" />
                                        View All Leads
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Leads</h3>
                            <div className="space-y-4">
                                {stats.recentBuyers.length > 0 ? (
                                    stats.recentBuyers.map((buyer: DashboardStats['recentBuyers'][0], index: number) => (
                                        <motion.div
                                            key={buyer.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                                            className="flex items-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {buyer.fullName.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{buyer.fullName}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{buyer.email}</p>
                                            </div>
                                            <div className="ml-4">
                                                <StatusBadge status={buyer.status} size="sm" />
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent leads found</p>
                                )}
                            </div>
                            {stats.recentBuyers.length > 0 && (
                                <div className="mt-6 text-center">
                                    <Link href="/buyers">
                                        <Button variant="outline" className="border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            View All Leads
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
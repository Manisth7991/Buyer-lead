'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { BuyersAPI } from '@/lib/api/buyers'
import { formatCurrency } from '@/lib/utils'
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    HomeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    TagIcon
} from '@heroicons/react/24/outline'

type BuyerWithOwner = {
    id: string
    fullName: string
    phone: string
    email?: string | null
    city: string
    locality?: string | null
    propertyType: string
    bhk?: string | null
    status: string
    timeline: string
    budgetMin?: number | null
    budgetMax?: number | null
    ownerId: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
    owner: {
        id: string
        name?: string | null
        email?: string | null
    }
}

interface BuyersTableProps {
    buyers: BuyerWithOwner[]
    currentUserId: string
}

export function BuyersTable({ buyers, currentUserId }: BuyersTableProps) {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this buyer lead?')) {
            return
        }

        setLoadingStates(prev => ({ ...prev, [id]: true }))

        try {
            await BuyersAPI.deleteBuyer(id)
            window.location.reload() // Simple refresh for now
        } catch (error) {
            console.error('Failed to delete buyer:', error)
            alert('Failed to delete buyer. Please try again.')
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: false }))
        }
    }

    if (buyers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <HomeIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No buyer leads found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Get started by adding your first buyer lead or adjust your search filters.
                </p>
                <Link href="/buyers/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl">
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Add Your First Lead
                    </Button>
                </Link>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                <div className="flex items-center space-x-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Contact Info</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                <div className="flex items-center space-x-2">
                                    <HomeIcon className="w-4 h-4" />
                                    <span>Property Details</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Timeline</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                <div className="flex items-center space-x-2">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                    <span>Budget</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">Owner</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                <div className="flex items-center space-x-2">
                                    <TagIcon className="w-4 h-4" />
                                    <span>Tags</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {buyers.map((buyer, index) => (
                                <motion.tr
                                    key={buyer.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                >
                                    <TableCell className="py-4">
                                        <div className="space-y-2">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                                                        {buyer.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span>{buyer.fullName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                                <PhoneIcon className="w-4 h-4" />
                                                <span>{buyer.phone}</span>
                                            </div>
                                            {buyer.email && (
                                                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <EnvelopeIcon className="w-4 h-4" />
                                                    <span>{buyer.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{buyer.propertyType}</span>
                                                {buyer.bhk && <span className="text-gray-500 dark:text-gray-400 ml-1">- {buyer.bhk} BHK</span>}
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>{buyer.city}</span>
                                            </div>
                                            {buyer.locality && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 ml-5">{buyer.locality}</div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <StatusBadge status={buyer.status} size="sm" />
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <StatusBadge status={buyer.timeline} size="sm" />
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-1">
                                            {buyer.budgetMin && buyer.budgetMax ? (
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                                                </div>
                                            ) : buyer.budgetMin ? (
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">From {formatCurrency(buyer.budgetMin)}</div>
                                            ) : buyer.budgetMax ? (
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Up to {formatCurrency(buyer.budgetMax)}</div>
                                            ) : (
                                                <div className="text-sm text-gray-400 dark:text-gray-500">Not specified</div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{buyer.owner.name}</div>
                                            <div className="text-gray-500 dark:text-gray-400">{buyer.owner.email}</div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(() => {
                                                const tags = Array.isArray(buyer.tags)
                                                    ? buyer.tags
                                                    : JSON.parse(buyer.tags || '[]')
                                                return tags.length > 0 ? (
                                                    tags.map((tag: string) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">No tags</span>
                                                )
                                            })()}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="flex items-center space-x-2">
                                            <Link href={`/buyers/${buyer.id}`}>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            </Link>

                                            {buyer.ownerId === currentUserId && (
                                                <>
                                                    <Link href={`/buyers/${buyer.id}/edit`}>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </Link>

                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(buyer.id)}
                                                            disabled={loadingStates[buyer.id]}
                                                            className="border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50"
                                                        >
                                                            {loadingStates[buyer.id] ? (
                                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                                            ) : (
                                                                <TrashIcon className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
                <AnimatePresence>
                    {buyers.map((buyer, index) => (
                        <motion.div
                            key={buyer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Header with name and status */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                            {buyer.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{buyer.fullName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{buyer.owner.name}</p>
                                    </div>
                                </div>
                                <StatusBadge status={buyer.status} size="sm" />
                            </div>

                            {/* Contact details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>{buyer.phone}</span>
                                </div>
                                {buyer.email && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <EnvelopeIcon className="w-4 h-4" />
                                        <span>{buyer.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Property details */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <HomeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{buyer.propertyType}</span>
                                    {buyer.bhk && <span className="text-gray-500 dark:text-gray-400">- {buyer.bhk} BHK</span>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{buyer.city}</span>
                                    {buyer.locality && <span className="text-sm text-gray-500 dark:text-gray-500">• {buyer.locality}</span>}
                                </div>
                            </div>

                            {/* Timeline and Budget */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                                    <StatusBadge status={buyer.timeline} size="sm" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                                    {buyer.budgetMin && buyer.budgetMax ? (
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                                        </p>
                                    ) : buyer.budgetMin ? (
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">From {formatCurrency(buyer.budgetMin)}</p>
                                    ) : buyer.budgetMax ? (
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Up to {formatCurrency(buyer.budgetMax)}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 dark:text-gray-500">Not specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {(() => {
                                const tags = Array.isArray(buyer.tags)
                                    ? buyer.tags
                                    : JSON.parse(buyer.tags || '[]')
                                return tags.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Link href={`/buyers/${buyer.id}`}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                                        >
                                            <EyeIcon className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                    </motion.div>
                                </Link>

                                {buyer.ownerId === currentUserId && (
                                    <>
                                        <Link href={`/buyers/${buyer.id}/edit`}>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200"
                                                >
                                                    <PencilIcon className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </motion.div>
                                        </Link>

                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(buyer.id)}
                                                disabled={loadingStates[buyer.id]}
                                                className="border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50"
                                            >
                                                {loadingStates[buyer.id] ? (
                                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1" />
                                                ) : (
                                                    <TrashIcon className="w-4 h-4 mr-1" />
                                                )}
                                                Delete
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
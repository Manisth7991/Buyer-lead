'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'CONTACTED': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'QUALIFIED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'VISITED': return 'bg-purple-50 text-purple-700 border-purple-200'
            case 'NEGOTIATION': return 'bg-orange-50 text-orange-700 border-orange-200'
            case 'CONVERTED': return 'bg-green-50 text-green-700 border-green-200'
            case 'DROPPED': return 'bg-red-50 text-red-700 border-red-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const getTimelineColor = (timeline: string) => {
        switch (timeline) {
            case 'ZERO_TO_THREE_MONTHS': return 'bg-red-50 text-red-700 border-red-200'
            case 'THREE_TO_SIX_MONTHS': return 'bg-orange-50 text-orange-700 border-orange-200'
            case 'MORE_THAN_SIX_MONTHS': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'EXPLORING': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center space-x-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Contact Info</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center space-x-2">
                                    <HomeIcon className="w-4 h-4" />
                                    <span>Property Details</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Timeline</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center space-x-2">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                    <span>Budget</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Owner</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center space-x-2">
                                    <TagIcon className="w-4 h-4" />
                                    <span>Tags</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Actions</TableHead>
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
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <TableCell className="py-4">
                                        <div className="space-y-2">
                                            <div className="font-medium text-gray-900 flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {buyer.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span>{buyer.fullName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                <PhoneIcon className="w-4 h-4" />
                                                <span>{buyer.phone}</span>
                                            </div>
                                            {buyer.email && (
                                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                    <EnvelopeIcon className="w-4 h-4" />
                                                    <span>{buyer.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{buyer.propertyType}</span>
                                                {buyer.bhk && <span className="text-gray-500 ml-1">- {buyer.bhk} BHK</span>}
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>{buyer.city}</span>
                                            </div>
                                            {buyer.locality && (
                                                <div className="text-sm text-gray-500 ml-5">{buyer.locality}</div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <Badge className={`${getStatusColor(buyer.status)} border font-medium`}>
                                            {buyer.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <Badge variant="outline" className={`${getTimelineColor(buyer.timeline)} border font-medium`}>
                                            {buyer.timeline.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="space-y-1">
                                            {buyer.budgetMin && buyer.budgetMax ? (
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                                                </div>
                                            ) : buyer.budgetMin ? (
                                                <div className="text-sm font-medium text-gray-900">From {formatCurrency(buyer.budgetMin)}</div>
                                            ) : buyer.budgetMax ? (
                                                <div className="text-sm font-medium text-gray-900">Up to {formatCurrency(buyer.budgetMax)}</div>
                                            ) : (
                                                <div className="text-sm text-gray-400">Not specified</div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{buyer.owner.name}</div>
                                            <div className="text-gray-500">{buyer.owner.email}</div>
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
                                                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                                            {tag}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400">No tags</span>
                                                )
                                            })()}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="flex items-center space-x-2">
                                            <Link href={`/buyers/${buyer.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            {buyer.ownerId === currentUserId && (
                                                <>
                                                    <Link href={`/buyers/${buyer.id}/edit`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-300 hover:border-green-400 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(buyer.id)}
                                                        disabled={loadingStates[buyer.id]}
                                                        className="border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50"
                                                    >
                                                        {loadingStates[buyer.id] ? (
                                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                                        ) : (
                                                            <TrashIcon className="w-4 h-4" />
                                                        )}
                                                    </Button>
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
        </motion.div>
    )
}
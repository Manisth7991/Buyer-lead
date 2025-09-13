'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BuyersAPI } from '@/lib/api/buyers'
import { formatCurrency } from '@/lib/utils'

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
            case 'NEW': return 'bg-blue-100 text-blue-800'
            case 'CONTACTED': return 'bg-yellow-100 text-yellow-800'
            case 'QUALIFIED': return 'bg-green-100 text-green-800'
            case 'VIEWING': return 'bg-purple-100 text-purple-800'
            case 'NEGOTIATING': return 'bg-orange-100 text-orange-800'
            case 'CLOSED': return 'bg-green-100 text-green-800'
            case 'LOST': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getTimelineColor = (timeline: string) => {
        switch (timeline) {
            case 'IMMEDIATE': return 'bg-red-100 text-red-800'
            case 'WITHIN_MONTH': return 'bg-orange-100 text-orange-800'
            case 'WITHIN_3_MONTHS': return 'bg-yellow-100 text-yellow-800'
            case 'WITHIN_6_MONTHS': return 'bg-blue-100 text-blue-800'
            case 'NO_RUSH': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (buyers.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No buyer leads found.</p>
                <Link href="/buyers/new" className="mt-4 inline-block">
                    <Button>Add Your First Lead</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Property Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {buyers.map((buyer) => (
                        <TableRow key={buyer.id}>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium text-gray-900">{buyer.fullName}</div>
                                    <div className="text-sm text-gray-500">{buyer.phone}</div>
                                    {buyer.email && (
                                        <div className="text-sm text-gray-500">{buyer.email}</div>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1">
                                    <div className="text-sm">
                                        <span className="font-medium">{buyer.propertyType}</span>
                                        {buyer.bhk && <span className="text-gray-500"> - {buyer.bhk} BHK</span>}
                                    </div>
                                    <div className="text-sm text-gray-500">{buyer.city}</div>
                                    {buyer.locality && (
                                        <div className="text-sm text-gray-500">{buyer.locality}</div>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge className={getStatusColor(buyer.status)}>
                                    {buyer.status.replace('_', ' ')}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline" className={getTimelineColor(buyer.timeline)}>
                                    {buyer.timeline.replace('_', ' ')}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1">
                                    {buyer.budgetMin && buyer.budgetMax ? (
                                        <div className="text-sm">
                                            {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                                        </div>
                                    ) : buyer.budgetMin ? (
                                        <div className="text-sm">From {formatCurrency(buyer.budgetMin)}</div>
                                    ) : buyer.budgetMax ? (
                                        <div className="text-sm">Up to {formatCurrency(buyer.budgetMax)}</div>
                                    ) : (
                                        <div className="text-sm text-gray-400">Not specified</div>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">{buyer.owner.name}</div>
                                    <div className="text-gray-500">{buyer.owner.email}</div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {buyer.tags.length > 0 ? (
                                        buyer.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">No tags</span>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Link href={`/buyers/${buyer.id}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>

                                    {buyer.ownerId === currentUserId && (
                                        <>
                                            <Link href={`/buyers/${buyer.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(buyer.id)}
                                                disabled={loadingStates[buyer.id]}
                                            >
                                                {loadingStates[buyer.id] ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
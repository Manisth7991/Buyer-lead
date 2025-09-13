'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BuyersAPI } from '@/lib/api/buyers'
import { formatCurrency } from '@/lib/utils'

type BuyerWithHistory = {
    id: string
    fullName: string
    phone: string
    email?: string | null
    city: string
    propertyType: string
    bhk?: string | null
    purpose: string
    timeline: string
    source: string
    status: string
    budgetMin?: number | null
    budgetMax?: number | null
    notes?: string | null
    tags: string[]
    ownerId: string
    createdAt: Date
    updatedAt: Date
    owner: {
        id: string
        name?: string | null
        email?: string | null
    }
    history: Array<{
        id: string
        diff: {
            action: string
            [key: string]: any
        }
        changedAt: Date
        changedByUser: {
            id: string
            name?: string | null
            email?: string | null
        }
    }>
}

interface BuyerDetailsProps {
    buyer: BuyerWithHistory
    currentUserId: string
}

export function BuyerDetails({ buyer, currentUserId }: BuyerDetailsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this buyer lead? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            await BuyersAPI.deleteBuyer(buyer.id)
            router.push('/buyers')
        } catch (error) {
            console.error('Failed to delete buyer:', error)
            alert('Failed to delete buyer. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        try {
            const updatePayload = {
                fullName: buyer.fullName,
                phone: buyer.phone,
                email: buyer.email || undefined,
                city: buyer.city as any,
                propertyType: buyer.propertyType as any,
                bhk: buyer.bhk as any,
                purpose: buyer.purpose as any,
                timeline: buyer.timeline as any,
                source: buyer.source as any,
                budgetMin: buyer.budgetMin || undefined,
                budgetMax: buyer.budgetMax || undefined,
                notes: buyer.notes || undefined,
                status: newStatus as any,
                id: buyer.id,
                updatedAt: new Date().toISOString(),
                tags: JSON.stringify(buyer.tags)
            }
            await BuyersAPI.updateBuyer(buyer.id, updatePayload)
            window.location.reload() // Simple refresh
        } catch (error) {
            console.error('Failed to update status:', error)
            alert('Failed to update status. Please try again.')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800'
            case 'CONTACTED': return 'bg-yellow-100 text-yellow-800'
            case 'QUALIFIED': return 'bg-green-100 text-green-800'
            case 'VISITED': return 'bg-purple-100 text-purple-800'
            case 'NEGOTIATION': return 'bg-orange-100 text-orange-800'
            case 'CONVERTED': return 'bg-green-100 text-green-800'
            case 'DROPPED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getTimelineColor = (timeline: string) => {
        switch (timeline) {
            case 'ZERO_TO_THREE_MONTHS': return 'bg-red-100 text-red-800'
            case 'THREE_TO_SIX_MONTHS': return 'bg-orange-100 text-orange-800'
            case 'MORE_THAN_SIX_MONTHS': return 'bg-yellow-100 text-yellow-800'
            case 'EXPLORING': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const canEdit = buyer.ownerId === currentUserId

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">{buyer.fullName}</h1>
                            <Badge className={getStatusColor(buyer.status)}>
                                {buyer.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Lead created on {new Date(buyer.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href="/buyers">
                            <Button variant="outline">← Back to List</Button>
                        </Link>

                        {canEdit && (
                            <>
                                <Link href={`/buyers/${buyer.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Phone:</span>
                                <p className="mt-1 text-sm text-gray-900">{buyer.phone}</p>
                            </div>

                            {buyer.email && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Email:</span>
                                    <p className="mt-1 text-sm text-gray-900">{buyer.email}</p>
                                </div>
                            )}

                            <div>
                                <span className="text-sm font-medium text-gray-500">City:</span>
                                <p className="mt-1 text-sm text-gray-900">{buyer.city}</p>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-500">Source:</span>
                                <p className="mt-1 text-sm text-gray-900">{buyer.source}</p>
                            </div>
                        </div>
                    </div>

                    {/* Property Requirements */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Property Type:</span>
                                <p className="mt-1 text-sm text-gray-900">{buyer.propertyType}</p>
                            </div>

                            {buyer.bhk && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">BHK:</span>
                                    <p className="mt-1 text-sm text-gray-900">{buyer.bhk.replace('_', ' ')}</p>
                                </div>
                            )}

                            <div>
                                <span className="text-sm font-medium text-gray-500">Purpose:</span>
                                <p className="mt-1 text-sm text-gray-900">{buyer.purpose}</p>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-500">Timeline:</span>
                                <Badge variant="outline" className={getTimelineColor(buyer.timeline)}>
                                    {buyer.timeline.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Budget Information */}
                    {(buyer.budgetMin || buyer.budgetMax) && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Information</h2>
                            <div className="space-y-2">
                                {buyer.budgetMin && buyer.budgetMax ? (
                                    <p className="text-sm text-gray-900">
                                        {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                                    </p>
                                ) : buyer.budgetMin ? (
                                    <p className="text-sm text-gray-900">From {formatCurrency(buyer.budgetMin)}</p>
                                ) : buyer.budgetMax ? (
                                    <p className="text-sm text-gray-900">Up to {formatCurrency(buyer.budgetMax)}</p>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {buyer.notes && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{buyer.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Actions */}
                    {canEdit && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                            <div className="space-y-2">
                                {['NEW', 'CONTACTED', 'QUALIFIED', 'VISITED', 'NEGOTIATION', 'CONVERTED', 'DROPPED'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={buyer.status === status ? "default" : "outline"}
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => handleStatusChange(status)}
                                        disabled={buyer.status === status}
                                    >
                                        {status.replace('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Owner Information */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Owner</h3>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">{buyer.owner.name}</p>
                            <p className="text-sm text-gray-500">{buyer.owner.email}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    {buyer.tags.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {buyer.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    {buyer.history.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {buyer.history.slice(0, 5).map((event) => (
                                    <div key={event.id} className="text-sm">
                                        <p className="font-medium text-gray-900">{event.diff.action}</p>
                                        <p className="text-gray-500">
                                            by {event.changedByUser.name} • {new Date(event.changedAt).toLocaleDateString()}
                                        </p>
                                        {event.diff.details && (
                                            <p className="text-gray-600 mt-1">{event.diff.details}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BuyerFilter } from '@/lib/validations/buyer'

interface BuyersFiltersProps {
    initialFilters: BuyerFilter
}

export function BuyersFilters({ initialFilters }: BuyersFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<BuyerFilter>(initialFilters)
    const [searchValue, setSearchValue] = useState(initialFilters.search || '')

    // Debounced search function
    const debounce = useCallback((func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout
        return (...args: any[]) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func.apply(null, args), delay)
        }
    }, [])

    // Update URL with new filters
    const updateURL = useCallback((newFilters: Partial<BuyerFilter>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== '') {
                params.set(key, value.toString())
            } else {
                params.delete(key)
            }
        })

        // Reset to page 1 when filters change
        if (Object.keys(newFilters).some(key => key !== 'page')) {
            params.set('page', '1')
        }

        router.push(`/buyers?${params.toString()}`)
    }, [router, searchParams])

    // Debounced search update
    const debouncedSearchUpdate = useCallback(
        debounce((searchTerm: string) => {
            updateURL({ search: searchTerm })
        }, 500),
        [updateURL]
    )

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchValue(value)
        debouncedSearchUpdate(value)
    }

    // Handle filter change
    const handleFilterChange = (key: keyof BuyerFilter, value: string) => {
        const newFilters = { ...filters, [key]: value || undefined }
        setFilters(newFilters)
        updateURL({ [key]: value || undefined })
    }

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            search: undefined,
            city: undefined,
            propertyType: undefined,
            status: undefined,
            timeline: undefined,
            sortBy: 'updatedAt',
            sortOrder: 'desc',
            page: 1,
            limit: 10,
        })
        setSearchValue('')
        router.push('/buyers')
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <Input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* City Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                    </label>
                    <Select
                        value={filters.city || ''}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                    >
                        <option value="">All Cities</option>
                        <option value="CHANDIGARH">Chandigarh</option>
                        <option value="MOHALI">Mohali</option>
                        <option value="ZIRAKPUR">Zirakpur</option>
                        <option value="PANCHKULA">Panchkula</option>
                        <option value="OTHER">Other</option>
                    </Select>
                </div>

                {/* Property Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                    </label>
                    <Select
                        value={filters.propertyType || ''}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                        <option value="PLOT">Plot</option>
                        <option value="OFFICE">Office</option>
                        <option value="RETAIL">Retail</option>
                    </Select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <Select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="VISITED">Visited</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="DROPPED">Dropped</option>
                    </Select>
                </div>

                {/* Timeline Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timeline
                    </label>
                    <Select
                        value={filters.timeline || ''}
                        onChange={(e) => handleFilterChange('timeline', e.target.value)}
                    >
                        <option value="">All Timelines</option>
                        <option value="ZERO_TO_THREE_MONTHS">0-3 Months</option>
                        <option value="THREE_TO_SIX_MONTHS">3-6 Months</option>
                        <option value="MORE_THAN_SIX_MONTHS">6+ Months</option>
                        <option value="EXPLORING">Just Exploring</option>
                    </Select>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <Select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="updatedAt">Last Updated</option>
                            <option value="createdAt">Created Date</option>
                            <option value="fullName">Name</option>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Order:</label>
                        <Select
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </Select>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="text-sm"
                >
                    Clear All Filters
                </Button>
            </div>
        </div>
    )
}
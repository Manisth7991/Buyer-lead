'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BuyerFilter } from '@/lib/validations/buyer'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    MapPinIcon,
    HomeIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline'

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <FunnelIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filter Leads</h3>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                    {/* Search - Full width on mobile, 2 cols on larger screens */}
                    <div className="sm:col-span-2 xl:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <MagnifyingGlassIcon className="w-4 h-4" />
                                <span>Search</span>
                            </div>
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* City Filter */}
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <MapPinIcon className="w-4 h-4" />
                                <span>City</span>
                            </div>
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
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <HomeIcon className="w-4 h-4" />
                                <span>Property Type</span>
                            </div>
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
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>Status</span>
                            </div>
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
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <ClockIcon className="w-4 h-4" />
                                <span>Timeline</span>
                            </div>
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

                {/* Sort and Clear Section - Mobile Responsive */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex lg:items-center lg:space-x-6">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
                                <Select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="min-w-0 flex-1"
                                >
                                    <option value="updatedAt">Last Updated</option>
                                    <option value="createdAt">Created Date</option>
                                    <option value="fullName">Name</option>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Order:</label>
                                <Select
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                    className="min-w-0 flex-1"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </Select>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            className="w-full sm:w-auto border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <XMarkIcon className="w-4 h-4 mr-2" />
                            Clear All Filters
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
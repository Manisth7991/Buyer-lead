'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BuyersAPI } from '@/lib/api/buyers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface BuyerFormProps {
  mode: 'create' | 'edit'
  initialData?: any
  buyerId?: string
}

export function BuyerForm({ mode, initialData, buyerId }: BuyerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    city: initialData?.city || '',
    propertyType: initialData?.propertyType || '',
    bhk: initialData?.bhk || '',
    purpose: initialData?.purpose || 'BUY',
    timeline: initialData?.timeline || 'ZERO_TO_THREE_MONTHS',
    source: initialData?.source || 'WEBSITE',
    budgetMin: initialData?.budgetMin || '',
    budgetMax: initialData?.budgetMax || '',
    notes: initialData?.notes || '',
    updatedAt: initialData?.updatedAt || new Date().toISOString(), // Include updatedAt for concurrency control
  })
  const [tags, setTags] = useState<string[]>(() => {
    if (!initialData?.tags) return []
    if (typeof initialData.tags === 'string') {
      try {
        return JSON.parse(initialData.tags)
      } catch {
        return []
      }
    }
    if (Array.isArray(initialData.tags)) {
      return initialData.tags
    }
    return []
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Utility function to ensure tags is always an array
  const safeTagsArray = Array.isArray(tags) ? tags : []

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.city) {
      newErrors.city = 'City is required'
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required'
    }
    if (['APARTMENT', 'VILLA'].includes(formData.propertyType) && !formData.bhk) {
      newErrors.bhk = 'BHK is required for apartments and villas'
    }
    if (formData.budgetMin && formData.budgetMax) {
      const min = parseInt(formData.budgetMin)
      const max = parseInt(formData.budgetMax)
      if (max < min) {
        newErrors.budgetMax = 'Maximum budget must be greater than or equal to minimum budget'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
        tags: JSON.stringify(safeTagsArray),
      }

      if (mode === 'create') {
        await BuyersAPI.createBuyer(payload)
        router.push('/buyers')
      } else if (mode === 'edit' && buyerId) {
        const updatePayload = {
          ...payload,
          id: buyerId,
          status: initialData?.status || 'NEW',
          updatedAt: formData.updatedAt, // Use original updatedAt for concurrency control
          tags: JSON.stringify(safeTagsArray), // Convert tags array to JSON string for API
        }
        await BuyersAPI.updateBuyer(buyerId, updatePayload)
        router.push(`/buyers/${buyerId}`)
      }
    } catch (error) {
      console.error('Failed to save buyer:', error)
      alert('Failed to save buyer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !safeTagsArray.includes(tagInput.trim())) {
      setTags([...safeTagsArray, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(safeTagsArray.filter(tag => tag !== tagToRemove))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600">Basic contact details for the buyer</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
                    <span>Full Name *</span>
                  </div>
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={`transition-all duration-200 ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.fullName}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Phone Number *</span>
                  </div>
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={`transition-all duration-200 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>Email (Optional)</span>
                  </div>
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  type="email"
                  placeholder="Enter email address"
                  className={`transition-all duration-200 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>City *</span>
                  </div>
                </label>
                <Select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`transition-all duration-200 ${errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                >
                  <option value="">Select City</option>
                  <option value="CHANDIGARH">Chandigarh</option>
                  <option value="MOHALI">Mohali</option>
                  <option value="ZIRAKPUR">Zirakpur</option>
                  <option value="PANCHKULA">Panchkula</option>
                  <option value="OTHER">Other</option>
                </Select>
                {errors.city && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.city}</span>
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Property Requirements Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Property Requirements</h3>
                <p className="text-sm text-gray-600">Specify the type and details of property needed</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>Property Type *</span>
                  </div>
                </label>
                <Select
                  value={formData.propertyType}
                  onChange={(e) => {
                    handleInputChange('propertyType', e.target.value)
                    // Clear BHK if property type doesn't need it
                    if (!['APARTMENT', 'VILLA'].includes(e.target.value)) {
                      handleInputChange('bhk', '')
                    }
                  }}
                  className={`transition-all duration-200 ${errors.propertyType ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                >
                  <option value="">Select Property Type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="PLOT">Plot</option>
                  <option value="OFFICE">Office</option>
                  <option value="RETAIL">Retail</option>
                </Select>
                {errors.propertyType && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.propertyType}</span>
                  </motion.p>
                )}
              </div>

              {/* Conditional BHK field */}
              {['APARTMENT', 'VILLA'].includes(formData.propertyType) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <HomeIcon className="w-4 h-4" />
                      <span>BHK *</span>
                    </div>
                  </label>
                  <Select
                    value={formData.bhk}
                    onChange={(e) => handleInputChange('bhk', e.target.value)}
                    className={`transition-all duration-200 ${errors.bhk ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  >
                    <option value="">Select BHK</option>
                    <option value="STUDIO">Studio</option>
                    <option value="ONE">1 BHK</option>
                    <option value="TWO">2 BHK</option>
                    <option value="THREE">3 BHK</option>
                    <option value="FOUR">4 BHK</option>
                  </Select>
                  {errors.bhk && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>{errors.bhk}</span>
                    </motion.p>
                  )}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-4 h-4" />
                    <span>Purpose *</span>
                  </div>
                </label>
                <Select
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="BUY">Buy</option>
                  <option value="RENT">Rent</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Timeline *</span>
                  </div>
                </label>
                <Select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="ZERO_TO_THREE_MONTHS">0-3 Months</option>
                  <option value="THREE_TO_SIX_MONTHS">3-6 Months</option>
                  <option value="MORE_THAN_SIX_MONTHS">6+ Months</option>
                  <option value="EXPLORING">Just Exploring</option>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Budget Information</h3>
                <p className="text-sm text-gray-600">Expected budget range for the property</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>Minimum Budget</span>
                  </div>
                </label>
                <Input
                  value={formData.budgetMin}
                  onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                  type="number"
                  placeholder="Enter minimum budget"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>Maximum Budget</span>
                  </div>
                </label>
                <Input
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                  type="number"
                  placeholder="Enter maximum budget"
                  className={`transition-all duration-200 ${errors.budgetMax ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {errors.budgetMax && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{errors.budgetMax}</span>
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                <p className="text-sm text-gray-600">Extra details and preferences</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <Select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="WALK_IN">Walk-in</option>
                  <option value="CALL">Phone Call</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Notes</span>
                </div>
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                placeholder="Enter any specific requirements, preferences, or notes"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-5 h-5 text-purple-500" />
                  <span>Tags</span>
                  <span className="text-xs text-gray-500 font-normal">
                    ({safeTagsArray.length} tag{safeTagsArray.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </label>

              <div className="space-y-4">
                {/* Tag Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Type a tag and press Enter..."
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    className="px-4 border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Tags Display */}
                {safeTagsArray.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Applied Tags:</h4>
                      {safeTagsArray.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setTags([])}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <motion.div
                      layout
                      className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border border-purple-100"
                    >
                      {Array.isArray(tags) && safeTagsArray.map((tag, index) => (
                        <motion.span
                          key={`${tag}-${index}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -20 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            delay: index * 0.05
                          }}
                          className="group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 hover:from-purple-200 hover:to-blue-200 hover:border-purple-300 transition-all duration-200 shadow-sm"
                        >
                          <span className="max-w-32 truncate">{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 p-0.5 rounded-full text-purple-500 hover:text-red-500 hover:bg-red-100 transition-all duration-200 group-hover:scale-110"
                            title={`Remove "${tag}" tag`}
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Tag suggestions */}
                    {safeTagsArray.length < 5 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-1.5"
                      >
                        <span className="text-xs text-gray-500 mr-2">Quick add:</span>
                        {['Hot Lead', 'Follow Up', 'Qualified', 'High Priority', 'Urgent'].filter(suggestion =>
                          !safeTagsArray.includes(suggestion)
                        ).slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              if (!safeTagsArray.includes(suggestion)) {
                                setTags([...safeTagsArray, suggestion])
                              }
                            }}
                            className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Empty state */}
                {safeTagsArray.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg"
                  >
                    <TagIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No tags added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Add tags to categorize and organize this lead</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <PlusIcon className="w-4 h-4" />
                  <span>{mode === 'create' ? 'Create Lead' : 'Update Lead'}</span>
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}
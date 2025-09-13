'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuyersAPI } from '@/lib/api/buyers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

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
  })
  const [tags, setTags] = useState<string[]>(
    initialData?.tags ? JSON.parse(initialData.tags) : []
  )
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        tags: JSON.stringify(tags),
      }

      if (mode === 'create') {
        await BuyersAPI.createBuyer(payload)
        router.push('/buyers')
      } else if (mode === 'edit' && buyerId) {
        const updatePayload = {
          ...payload,
          id: buyerId,
          status: 'NEW' as const,
          updatedAt: new Date().toISOString(),
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
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter full name"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                type="email"
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Select
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              >
                <option value="">Select City</option>
                <option value="CHANDIGARH">Chandigarh</option>
                <option value="MOHALI">Mohali</option>
                <option value="ZIRAKPUR">Zirakpur</option>
                <option value="PANCHKULA">Panchkula</option>
                <option value="OTHER">Other</option>
              </Select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type *
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
                className={errors.propertyType ? 'border-red-500' : ''}
              >
                <option value="">Select Property Type</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="PLOT">Plot</option>
                <option value="OFFICE">Office</option>
                <option value="RETAIL">Retail</option>
              </Select>
              {errors.propertyType && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
              )}
            </div>

            {/* Conditional BHK field */}
            {['APARTMENT', 'VILLA'].includes(formData.propertyType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BHK *
                </label>
                <Select
                  value={formData.bhk}
                  onChange={(e) => handleInputChange('bhk', e.target.value)}
                  className={errors.bhk ? 'border-red-500' : ''}
                >
                  <option value="">Select BHK</option>
                  <option value="STUDIO">Studio</option>
                  <option value="ONE">1 BHK</option>
                  <option value="TWO">2 BHK</option>
                  <option value="THREE">3 BHK</option>
                  <option value="FOUR">4 BHK</option>
                </Select>
                {errors.bhk && (
                  <p className="mt-1 text-sm text-red-600">{errors.bhk}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose *
              </label>
              <Select
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
              >
                <option value="BUY">Buy</option>
                <option value="RENT">Rent</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline *
              </label>
              <Select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              >
                <option value="ZERO_TO_THREE_MONTHS">0-3 Months</option>
                <option value="THREE_TO_SIX_MONTHS">3-6 Months</option>
                <option value="MORE_THAN_SIX_MONTHS">6+ Months</option>
                <option value="EXPLORING">Just Exploring</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Budget Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Budget
              </label>
              <Input
                value={formData.budgetMin}
                onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                type="number"
                placeholder="Enter minimum budget"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Budget
              </label>
              <Input
                value={formData.budgetMax}
                onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                type="number"
                placeholder="Enter maximum budget"
                className={errors.budgetMax ? 'border-red-500' : ''}
              />
              {errors.budgetMax && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetMax}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source *
            </label>
            <Select
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
            >
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="WALK_IN">Walk-in</option>
              <option value="CALL">Phone Call</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              placeholder="Enter any specific requirements, preferences, or notes"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (mode === 'create' ? 'Creating...' : 'Updating...')
              : (mode === 'create' ? 'Create Lead' : 'Update Lead')
            }
          </Button>
        </div>
      </form>
    </div>
  )
}
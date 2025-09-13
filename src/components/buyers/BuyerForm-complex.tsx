'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateBuyerSchema, type CreateBuyer } from '@/lib/validations/buyer'
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
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateBuyer>({
    resolver: zodResolver(CreateBuyerSchema),
    defaultValues: initialData || {
      purpose: 'BUY',
      status: 'NEW',
      timeline: 'ZERO_TO_THREE_MONTHS',
      source: 'WEBSITE',
      tags: '[]'
    }
  })

  const propertyType = watch('propertyType')

  const onSubmit = async (data: CreateBuyer) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        tags: JSON.stringify(tags)
      }

      if (mode === 'create') {
        await BuyersAPI.createBuyer(payload)
        router.push('/buyers')
      } else if (mode === 'edit' && buyerId) {
        // For update, we need to include id and updatedAt
        const updatePayload = {
          ...payload,
          id: buyerId,
          updatedAt: new Date().toISOString(),
          status: 'NEW' as const
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
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                {...register('fullName')}
                placeholder="Enter full name"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                {...register('phone')}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Select
                {...register('city')}
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
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
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
                {...register('propertyType')}
                onChange={(e) => {
                  setValue('propertyType', e.target.value as any)
                  // Clear BHK if property type doesn't need it
                  if (!['APARTMENT', 'VILLA'].includes(e.target.value)) {
                    setValue('bhk', undefined)
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
                <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
              )}
            </div>

            {/* Conditional BHK field */}
            {['APARTMENT', 'VILLA'].includes(propertyType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BHK *
                </label>
                <Select
                  {...register('bhk')}
                  className={errors.bhk ? 'border-red-500' : ''}
                >
                  <option value="">Select BHK</option>
                  <option value="ONE_BHK">1 BHK</option>
                  <option value="TWO_BHK">2 BHK</option>
                  <option value="THREE_BHK">3 BHK</option>
                  <option value="FOUR_BHK">4 BHK</option>
                  <option value="FIVE_PLUS_BHK">5+ BHK</option>
                </Select>
                {errors.bhk && (
                  <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose *
              </label>
              <Select
                {...register('purpose')}
                className={errors.purpose ? 'border-red-500' : ''}
              >
                <option value="BUY">Buy</option>
                <option value="RENT">Rent</option>
                <option value="INVEST">Investment</option>
              </Select>
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline *
              </label>
              <Select
                {...register('timeline')}
                className={errors.timeline ? 'border-red-500' : ''}
              >
                <option value="ZERO_TO_THREE_MONTHS">0-3 Months</option>
                <option value="THREE_TO_SIX_MONTHS">3-6 Months</option>
                <option value="MORE_THAN_SIX_MONTHS">6+ Months</option>
                <option value="EXPLORING">Just Exploring</option>
              </Select>
              {errors.timeline && (
                <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
              )}
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
                {...register('budgetMin', { valueAsNumber: true })}
                type="number"
                placeholder="Enter minimum budget"
                className={errors.budgetMin ? 'border-red-500' : ''}
              />
              {errors.budgetMin && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Budget
              </label>
              <Input
                {...register('budgetMax', { valueAsNumber: true })}
                type="number"
                placeholder="Enter maximum budget"
                className={errors.budgetMax ? 'border-red-500' : ''}
              />
              {errors.budgetMax && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locality/Area
            </label>
            <Input
              {...register('locality')}
              placeholder="Enter preferred locality or area"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements & Notes
            </label>
            <Textarea
              {...register('requirements')}
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
              {tags.map((tag) => (
                <span
                  key={tag}
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
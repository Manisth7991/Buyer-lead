'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    CalendarIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
    const { data: session } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: session?.user?.name || 'Demo User',
        email: session?.user?.email || 'demo@demo.com',
        phone: '+91 9876543211',
        location: 'MOHALI',
        role: 'Real Estate Agent',
        bio: 'Experienced real estate professional specializing in residential properties. Helping clients find their dream homes since 2020.',
        company: 'Dream Properties Inc.'
    })

    const handleSave = () => {
        // Here you would typically save to your backend
        console.log('Saving profile data:', formData)
        setIsEditing(false)
        // Show success message
        alert('Profile updated successfully!')
    }

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            name: session?.user?.name || 'Demo User',
            email: session?.user?.email || 'demo@demo.com',
            phone: '+91 9876543211',
            location: 'MOHALI',
            role: 'Real Estate Agent',
            bio: 'Experienced real estate professional specializing in residential properties. Helping clients find their dream homes since 2020.',
            company: 'Dream Properties Inc.'
        })
        setIsEditing(false)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-6 space-y-8"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                                <p className="text-gray-600">{formData.role}</p>
                                <p className="text-sm text-gray-500">{formData.company}</p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleSave}
                                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckIcon className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="cursor-pointer border-gray-300 hover:bg-gray-50"
                                >
                                    <XMarkIcon className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Profile Information */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <UserCircleIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            <p className="text-sm text-gray-600">Manage your personal details</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <UserCircleIcon className="w-4 h-4" />
                                    <span>Full Name</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <EnvelopeIcon className="w-4 h-4" />
                                    <span>Email Address</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Phone Number</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.phone}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>Location</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Enter your location"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.location}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <BriefcaseIcon className="w-4 h-4" />
                                    <span>Role</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    placeholder="Enter your role"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.role}</p>
                            )}
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <BriefcaseIcon className="w-4 h-4" />
                                    <span>Company</span>
                                </div>
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.company}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                    placeholder="Enter your company"
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            ) : (
                                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{formData.company}</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-4 h-4" />
                                <span>Bio</span>
                            </div>
                        </label>
                        {isEditing ? (
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself"
                                rows={4}
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            />
                        ) : (
                            <p className="text-gray-900 py-3 px-3 bg-gray-50 rounded-md">{formData.bio}</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Account Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Account Statistics</h3>
                            <p className="text-sm text-gray-600">Your activity overview</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">24</div>
                            <div className="text-sm text-gray-600">Total Leads</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">8</div>
                            <div className="text-sm text-gray-600">Converted</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">92%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useSettings } from '@/contexts/SettingsContext'
import {
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
    MoonIcon,
    SunIcon,
    ComputerDesktopIcon,
    CheckIcon
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
    const { theme, language, setTheme, setLanguage, actualTheme, t } = useSettings()
    const [activeTab, setActiveTab] = useState('general')
    const [showPassword, setShowPassword] = useState(false)
    const [localSettings, setLocalSettings] = useState({
        // General settings (theme and language are handled by context)
        timezone: 'asia_kolkata',
        dateFormat: 'dd/mm/yyyy',

        // Notification settings
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        leadAlerts: true,
        weeklyReports: true,

        // Privacy settings
        profileVisibility: 'team',
        dataSharing: false,
        analyticsTracking: true,

        // Security settings
        twoFactorAuth: false,
        sessionTimeout: '30',
        passwordMinLength: '8'
    })

    // Load local settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('localSettings')
        if (savedSettings) {
            setLocalSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
        }
    }, [])

    const tabs = [
        { id: 'general', name: t('general') || 'General', icon: Cog6ToothIcon },
        { id: 'notifications', name: t('notifications') || 'Notifications', icon: BellIcon },
        { id: 'privacy', name: t('privacy') || 'Privacy', icon: ShieldCheckIcon },
        { id: 'security', name: t('security') || 'Security', icon: ShieldCheckIcon }
    ]

    const handleLocalSettingChange = (key: string, value: any) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        // Save local settings to localStorage
        localStorage.setItem('localSettings', JSON.stringify(localSettings))
        console.log('Saving settings:', { theme, language, ...localSettings })
        alert('Settings saved successfully!')
    }

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                            <GlobeAltIcon className="w-4 h-4" />
                            <span>{t('language')}</span>
                        </div>
                    </label>
                    <Select
                        value={language}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as any)}
                        className="cursor-pointer"
                    >
                        <option value="english">English</option>
                        <option value="hindi">Hindi (हिंदी)</option>
                        <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                    </label>
                    <Select
                        value={localSettings.timezone}
                        onChange={(e) => handleLocalSettingChange('timezone', e.target.value)}
                        className="cursor-pointer"
                    >
                        <option value="asia_kolkata">Asia/Kolkata (IST)</option>
                        <option value="utc">UTC</option>
                        <option value="america_new_york">America/New_York</option>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('theme')}
                    </label>
                    <div className="flex space-x-4">
                        {[
                            { value: 'light', icon: SunIcon, label: 'Light' },
                            { value: 'dark', icon: MoonIcon, label: 'Dark' },
                            { value: 'system', icon: ComputerDesktopIcon, label: 'System' }
                        ].map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${theme === value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                    </label>
                    <Select
                        value={localSettings.dateFormat}
                        onChange={(e) => handleLocalSettingChange('dateFormat', e.target.value)}
                        className="cursor-pointer"
                    >
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </Select>
                </div>
            </div>
        </div>
    )

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: EnvelopeIcon },
                { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS', icon: PhoneIcon },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser', icon: BellIcon },
                { key: 'leadAlerts', label: 'Lead Alerts', description: 'Get notified when new leads are added', icon: BellIcon },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance reports', icon: EnvelopeIcon }
            ].map(({ key, label, description, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-500" />
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleLocalSettingChange(key, !localSettings[key as keyof typeof localSettings])}
                        className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${localSettings[key as keyof typeof localSettings] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${localSettings[key as keyof typeof localSettings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            ))}
        </div>
    )

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                </label>
                <Select
                    value={localSettings.profileVisibility}
                    onChange={(e) => handleLocalSettingChange('profileVisibility', e.target.value)}
                    className="cursor-pointer"
                >
                    <option value="public">Public</option>
                    <option value="team">Team Only</option>
                    <option value="private">Private</option>
                </Select>
                <p className="mt-1 text-sm text-gray-500">
                    Control who can see your profile information
                </p>
            </div>

            {[
                { key: 'dataSharing', label: 'Data Sharing', description: 'Allow anonymized data sharing for service improvement' },
                { key: 'analyticsTracking', label: 'Analytics Tracking', description: 'Enable usage analytics to help improve the platform' }
            ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                    <button
                        onClick={() => handleLocalSettingChange(key, !localSettings[key as keyof typeof localSettings])}
                        className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${localSettings[key as keyof typeof localSettings] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${localSettings[key as keyof typeof localSettings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            ))}
        </div>
    )

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                    onClick={() => handleLocalSettingChange('twoFactorAuth', !localSettings.twoFactorAuth)}
                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${localSettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${localSettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                </label>
                <Input
                    type="number"
                    value={localSettings.sessionTimeout}
                    onChange={(e) => handleLocalSettingChange('sessionTimeout', e.target.value)}
                    className="cursor-pointer"
                    min="5"
                    max="1440"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Automatically log out after this many minutes of inactivity
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Password
                </label>
                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Current password"
                            className="cursor-pointer pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    <Input
                        type="password"
                        placeholder="New password"
                        className="cursor-pointer"
                    />
                    <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="cursor-pointer"
                    />
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                        Update Password
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto p-6 space-y-8"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Cog6ToothIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-600">Manage your application preferences</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4">
                            <nav className="space-y-2">
                                {tabs.map(({ id, name, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                    {activeTab} Settings
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {activeTab === 'general' && 'Configure your general application preferences'}
                                    {activeTab === 'notifications' && 'Manage how you receive notifications'}
                                    {activeTab === 'privacy' && 'Control your privacy and data sharing preferences'}
                                    {activeTab === 'security' && 'Secure your account with advanced security options'}
                                </p>
                            </div>

                            {activeTab === 'general' && renderGeneralSettings()}
                            {activeTab === 'notifications' && renderNotificationSettings()}
                            {activeTab === 'privacy' && renderPrivacySettings()}
                            {activeTab === 'security' && renderSecuritySettings()}

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer border-gray-300 hover:bg-gray-50"
                                    >
                                        Reset to Defaults
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <CheckIcon className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
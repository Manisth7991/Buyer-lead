'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleDemoLogin = async () => {
        setLoading(true)
        try {
            const result = await signIn('demo', {
                email: 'demo@demo.com',
                redirect: false,
            })

            if (result?.ok) {
                router.push('/buyers')
            } else {
                setMessage('Demo login failed')
            }
        } catch (error) {
            setMessage('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to Lead Manager
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Use demo login to get started quickly
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Demo Login */}
                    <button
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Demo Login (demo@demo.com)'}
                    </button>

                    {message && (
                        <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('success')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
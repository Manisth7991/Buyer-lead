import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignOutButton } from './SignOutButton'

export default async function BuyersPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Buyer Leads Dashboard
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Welcome to the Lead Manager! The frontend is currently under development.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-2">✅ What's Working:</p>
                                    <ul className="list-disc list-inside space-y-1 text-left">
                                        <li>Authentication system</li>
                                        <li>Complete API endpoints for CRUD operations</li>
                                        <li>Database with Prisma ORM</li>
                                        <li>CSV import/export functionality</li>
                                        <li>Data validation with Zod</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                                <div className="text-sm text-yellow-700">
                                    <p className="font-medium mb-2">🚧 Coming Soon:</p>
                                    <ul className="list-disc list-inside space-y-1 text-left">
                                        <li>Buyers list with search and filters</li>
                                        <li>Create new buyer form</li>
                                        <li>Edit buyer functionality</li>
                                        <li>CSV upload interface</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Test API Endpoints</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h4 className="font-medium text-gray-900">GET /api/buyers</h4>
                                        <p className="text-sm text-gray-600">List all buyers</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h4 className="font-medium text-gray-900">POST /api/buyers</h4>
                                        <p className="text-sm text-gray-600">Create new buyer</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h4 className="font-medium text-gray-900">GET /api/buyers/export</h4>
                                        <p className="text-sm text-gray-600">Export to CSV</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h4 className="font-medium text-gray-900">POST /api/buyers/import</h4>
                                        <p className="text-sm text-gray-600">Import from CSV</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-sm text-gray-500">
                                    Logged in as: <span className="font-medium">{session.user.email}</span>
                                </p>
                                <SignOutButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
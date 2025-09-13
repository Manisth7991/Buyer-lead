import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CSVImport } from '@/components/buyers/CSVImport'

export default async function ImportBuyersPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Import Buyer Leads</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Upload a CSV file to import multiple buyer leads at once. Maximum 200 rows allowed.
                        </p>
                    </div>

                    {/* Import Component */}
                    <CSVImport />
                </div>
            </div>
        </div>
    )
}
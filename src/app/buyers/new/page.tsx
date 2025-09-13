import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BuyerForm } from '@/components/buyers/BuyerForm'

export default async function NewBuyerPage() {
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
                        <h1 className="text-3xl font-bold text-gray-900">Add New Buyer Lead</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Fill in the buyer's information and requirements.
                        </p>
                    </div>

                    {/* Form */}
                    <BuyerForm mode="create" />
                </div>
            </div>
        </div>
    )
}
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BuyerForm } from '@/components/buyers/BuyerForm'
import { PlusIcon } from '@heroicons/react/24/outline'

export default async function NewBuyerPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <PlusIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Buyer Lead</h1>
                            <p className="text-lg text-gray-600">
                                Fill in the buyer&apos;s information and requirements to create a new lead.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <BuyerForm mode="create" />
            </div>
        </div>
    )
}
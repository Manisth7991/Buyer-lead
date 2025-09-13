import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BuyerForm } from '@/components/buyers/BuyerForm'

interface EditBuyerPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    // Await params for Next.js 15
    const { id } = await params

    // Fetch buyer
    const buyer = await prisma.buyer.findUnique({
        where: { id },
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    if (!buyer) {
        notFound()
    }

    // Check if user can edit this buyer
    if (buyer.ownerId !== session.user.id) {
        redirect(`/buyers/${id}`)
    }

    // Transform buyer data for form
    const initialData = {
        ...buyer,
        budgetMin: buyer.budgetMin?.toString() || '',
        budgetMax: buyer.budgetMax?.toString() || '',
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Buyer Lead</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Update {buyer.fullName}'s information and requirements.
                        </p>
                    </div>

                    {/* Form */}
                    <BuyerForm
                        mode="edit"
                        initialData={initialData}
                        buyerId={buyer.id}
                    />
                </div>
            </div>
        </div>
    )
}
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BuyerDetails } from '@/components/buyers/BuyerDetails'

interface BuyerDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function BuyerDetailPage({ params }: BuyerDetailPageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    // Await params for Next.js 15
    const { id } = await params

    // Fetch buyer with history
    const buyer = await prisma.buyer.findUnique({
        where: { id },
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            },
            history: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    changedBy: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }
        }
    })

    if (!buyer) {
        notFound()
    }

    // Transform buyer data
    const transformedBuyer = {
        ...buyer,
        tags: JSON.parse(buyer.tags || '[]'),
        history: buyer.history
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <BuyerDetails
                        buyer={transformedBuyer}
                        currentUserId={session.user.id}
                    />
                </div>
            </div>
        </div>
    )
}
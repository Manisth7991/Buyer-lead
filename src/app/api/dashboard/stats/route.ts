import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Fetch dashboard statistics
        const [totalBuyers, recentBuyers, stats] = await Promise.all([
            prisma.buyer.count(),
            prisma.buyer.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: {
                        select: { name: true }
                    }
                }
            }),
            prisma.buyer.groupBy({
                by: ['status'],
                _count: {
                    status: true
                }
            })
        ])

        // Process stats
        const statusCounts = stats.reduce((acc: Record<string, number>, stat: { status: string; _count: { status: number } }) => {
            acc[stat.status] = stat._count.status
            return acc
        }, {})

        return NextResponse.json({
            totalBuyers,
            recentBuyers,
            statusCounts
        })
    } catch (error) {
        console.error('Dashboard stats API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
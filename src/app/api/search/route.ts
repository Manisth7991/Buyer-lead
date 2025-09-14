import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query) {
            return NextResponse.json([])
        }

        // Search buyers
        const buyers = await prisma.buyer.findMany({
            where: {
                OR: [
                    { fullName: { contains: query, mode: 'insensitive' } },
                    { phone: { contains: query } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } },
                    { propertyType: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 10,
            select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                city: true,
                propertyType: true,
                status: true,
            }
        })

        const results = buyers.map((buyer: {
            id: string;
            fullName: string;
            phone: string;
            email: string | null;
            city: string;
            propertyType: string;
            status: string;
        }) => ({
            ...buyer,
            type: 'buyer',
            title: buyer.fullName,
            subtitle: `${buyer.phone} • ${buyer.city}`,
            description: `${buyer.propertyType} • ${buyer.status}`
        }))

        return NextResponse.json(results)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}
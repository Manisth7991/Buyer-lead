import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CreateBuyerSchema, BuyerFilterSchema } from '@/lib/validations/buyer'
import { ZodError } from 'zod'

// GET /api/buyers - List buyers with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const queryParams = Object.fromEntries(searchParams.entries())

        const validatedParams = BuyerFilterSchema.parse(queryParams)

        const where: any = {}

        // Search across name, phone, and email
        if (validatedParams.search) {
            where.OR = [
                { fullName: { contains: validatedParams.search, mode: 'insensitive' } },
                { phone: { contains: validatedParams.search } },
                { email: { contains: validatedParams.search, mode: 'insensitive' } },
            ]
        }

        // Apply filters
        if (validatedParams.city) where.city = validatedParams.city
        if (validatedParams.propertyType) where.propertyType = validatedParams.propertyType
        if (validatedParams.status) where.status = validatedParams.status
        if (validatedParams.timeline) where.timeline = validatedParams.timeline

        const [buyers, total] = await Promise.all([
            prisma.buyer.findMany({
                where,
                include: {
                    owner: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: {
                    [validatedParams.sortBy]: validatedParams.sortOrder
                },
                skip: (validatedParams.page - 1) * validatedParams.limit,
                take: validatedParams.limit,
            }),
            prisma.buyer.count({ where })
        ])

        const totalPages = Math.ceil(total / validatedParams.limit)

        return NextResponse.json({
            success: true,
            data: {
                buyers: buyers.map((buyer: any) => ({
                    ...buyer,
                    tags: JSON.parse(buyer.tags || '[]')
                })),
                pagination: {
                    page: validatedParams.page,
                    limit: validatedParams.limit,
                    total,
                    totalPages,
                    hasNext: validatedParams.page < totalPages,
                    hasPrev: validatedParams.page > 1,
                }
            }
        })
    } catch (error) {
        console.error('Error fetching buyers:', error)

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/buyers - Create new buyer
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = CreateBuyerSchema.parse(body)

        // Convert tags array to JSON string
        const tagsJson = JSON.stringify(validatedData.tags || [])

        const buyer = await prisma.$transaction(async (tx: any) => {
            // Create the buyer
            const newBuyer = await tx.buyer.create({
                data: {
                    ...validatedData,
                    tags: tagsJson,
                    ownerId: session.user.id,
                },
                include: {
                    owner: {
                        select: { id: true, name: true, email: true }
                    }
                }
            })

            // Create history entry
            await tx.buyerHistory.create({
                data: {
                    buyerId: newBuyer.id,
                    changedBy: session.user.id,
                    diff: {
                        action: 'created',
                        data: validatedData
                    }
                }
            })

            return newBuyer
        })

        return NextResponse.json({
            success: true,
            data: {
                ...buyer,
                tags: JSON.parse(buyer.tags || '[]')
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating buyer:', error)

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
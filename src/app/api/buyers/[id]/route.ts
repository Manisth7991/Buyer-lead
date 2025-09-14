import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UpdateBuyerSchema } from '@/lib/validations/buyer'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// GET /api/buyers/[id] - Get single buyer
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Await params for Next.js 15
        const { id } = await params

        const buyer = await prisma.buyer.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { id: true, name: true, email: true }
                },
                history: {
                    include: {
                        changedByUser: {
                            select: { id: true, name: true, email: true }
                        }
                    },
                    orderBy: { changedAt: 'desc' },
                    take: 5
                }
            }
        })

        if (!buyer) {
            return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: {
                ...buyer,
                tags: JSON.parse(buyer.tags || '[]')
            }
        })
    } catch (error) {
        console.error('Error fetching buyer:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/buyers/[id] - Update buyer
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Await params for Next.js 15
        const { id } = await params

        let body
        try {
            body = await request.json()
        } catch (error) {
            console.error('JSON parsing error:', error)
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            )
        }

        const validatedData = UpdateBuyerSchema.parse(body)

        // Check if buyer exists and user owns it
        const existingBuyer = await prisma.buyer.findUnique({
            where: { id },
            select: { id: true, ownerId: true, updatedAt: true }
        })

        if (!existingBuyer) {
            return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
        }

        if (existingBuyer.ownerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check for concurrent updates
        const providedUpdatedAt = new Date(validatedData.updatedAt)
        if (existingBuyer.updatedAt.getTime() !== providedUpdatedAt.getTime()) {
            return NextResponse.json(
                { error: 'Record has been modified by another user. Please refresh and try again.' },
                { status: 409 }
            )
        }

        // Get current buyer for diff
        const currentBuyer = await prisma.buyer.findUnique({
            where: { id }
        })

        // Convert tags array to JSON string
        const tagsJson = JSON.stringify(validatedData.tags || [])

        const updatedBuyer = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Update buyer
            const buyer = await tx.buyer.update({
                where: { id },
                data: {
                    ...validatedData,
                    tags: tagsJson,
                    id: undefined, // Remove id from update data
                    updatedAt: undefined, // Let Prisma handle this
                },
                include: {
                    owner: {
                        select: { id: true, name: true, email: true }
                    }
                }
            })

            // Create history entry with diff
            const diff: Record<string, { old: unknown; new: unknown }> = {}
            Object.keys(validatedData).forEach(key => {
                if (key !== 'id' && key !== 'updatedAt') {
                    const newValue = (validatedData as Record<string, unknown>)[key]
                    const oldValue = (currentBuyer as Record<string, unknown>)?.[key]

                    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                        diff[key] = { old: oldValue, new: newValue }
                    }
                }
            })

            if (Object.keys(diff).length > 0) {
                await tx.buyerHistory.create({
                    data: {
                        buyerId: id,
                        changedBy: session.user.id,
                        diff: { action: 'updated', changes: diff }
                    }
                })
            }

            return buyer
        })

        return NextResponse.json({
            success: true,
            data: {
                ...updatedBuyer,
                tags: JSON.parse(updatedBuyer.tags || '[]')
            }
        })
    } catch (error) {
        console.error('Error updating buyer:', error)

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

// DELETE /api/buyers/[id] - Delete buyer
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Await params for Next.js 15
        const { id } = await params

        // Check if buyer exists and user owns it
        const existingBuyer = await prisma.buyer.findUnique({
            where: { id },
            select: { id: true, ownerId: true, fullName: true }
        })

        if (!existingBuyer) {
            return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
        }

        if (existingBuyer.ownerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create history entry
            await tx.buyerHistory.create({
                data: {
                    buyerId: id,
                    changedBy: session.user.id,
                    diff: { action: 'deleted', buyerName: existingBuyer.fullName }
                }
            })

            // Delete buyer (this will cascade delete history due to schema)
            await tx.buyer.delete({
                where: { id }
            })
        })

        return NextResponse.json({
            success: true,
            message: 'Buyer deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting buyer:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
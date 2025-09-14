import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateCSV } from '@/lib/csv'
import { BuyerFilterSchema } from '@/lib/validations/buyer'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const queryParams = Object.fromEntries(searchParams.entries())

        // Remove pagination for export (export all matching records)
        delete queryParams.page
        delete queryParams.limit

        const validatedParams = BuyerFilterSchema.omit({ page: true, limit: true }).parse(queryParams)

        const where: any = {}

        // Search across name, phone, and email (SQLite compatible)
        if (validatedParams.search) {
            where.OR = [
                { fullName: { contains: validatedParams.search } },
                { phone: { contains: validatedParams.search } },
                { email: { contains: validatedParams.search } },
            ]
        }

        // Apply filters
        if (validatedParams.city) where.city = validatedParams.city
        if (validatedParams.propertyType) where.propertyType = validatedParams.propertyType
        if (validatedParams.status) where.status = validatedParams.status
        if (validatedParams.timeline) where.timeline = validatedParams.timeline

        const buyers = await prisma.buyer.findMany({
            where,
            orderBy: {
                [validatedParams.sortBy]: validatedParams.sortOrder
            },
        })

        const csvContent = generateCSV(buyers as any[])

        const headers = new Headers()
        headers.set('Content-Type', 'text/csv')
        headers.set('Content-Disposition', `attachment; filename="buyers-${new Date().toISOString().split('T')[0]}.csv"`)

        return new Response(csvContent, { headers })
    } catch (error) {
        console.error('Error exporting CSV:', error)

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
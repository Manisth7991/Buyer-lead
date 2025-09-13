import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseCSV, validateCSVHeaders, CSVError } from '@/lib/csv'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
        }

        const csvContent = await file.text()

        // Validate headers
        validateCSVHeaders(csvContent)

        // Parse and validate CSV
        const result = await parseCSV(csvContent)

        if (result.errors.length > 0 && result.valid.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'All rows contain errors',
                errors: result.errors
            }, { status: 400 })
        }

        // Import valid records in a transaction
        let importedCount = 0
        if (result.valid.length > 0) {
            importedCount = await prisma.$transaction(async (tx: any) => {
                const buyers = []

                for (const validRecord of result.valid) {
                    const buyer = await tx.buyer.create({
                        data: {
                            ...validRecord,
                            ownerId: session.user.id,
                        }
                    })

                    // Create history entry
                    await tx.buyerHistory.create({
                        data: {
                            buyerId: buyer.id,
                            changedBy: session.user.id,
                            diff: {
                                action: 'imported',
                                data: validRecord
                            }
                        }
                    })

                    buyers.push(buyer)
                }

                return buyers.length
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                imported: importedCount,
                errors: result.errors,
                total: result.valid.length + result.errors.length
            }
        })
    } catch (error) {
        console.error('Error importing CSV:', error)

        if (error instanceof CSVError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
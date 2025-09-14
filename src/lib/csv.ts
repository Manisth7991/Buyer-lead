import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { CSVBuyerSchema, CSVValidationResult, CSV_HEADERS, transformEnumForCSV } from '@/lib/validations/csv'
import { Buyer } from '@/types'

export class CSVError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CSVError'
    }
}

export async function parseCSV(csvContent: string): Promise<CSVValidationResult> {
    try {
        // Parse CSV with headers
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        })

        if (records.length === 0) {
            throw new CSVError('CSV file is empty')
        }

        if (records.length > 200) {
            throw new CSVError('CSV file cannot contain more than 200 rows')
        }

        const result: CSVValidationResult = {
            valid: [],
            errors: []
        }

        for (let i = 0; i < records.length; i++) {
            const record = records[i]
            const rowNumber = i + 2 // +2 because of header row and 1-based indexing

            try {
                const validatedRecord = CSVBuyerSchema.parse(record)
                result.valid.push(validatedRecord)
            } catch (error: unknown) {
                const fieldErrors: Record<string, string[]> = {}

                if (error && typeof error === 'object' && 'errors' in error) {
                    const zodError = error as { errors: Array<{ path: string[]; message: string }> }
                    for (const err of zodError.errors) {
                        const path = err.path.join('.')
                        if (!fieldErrors[path]) {
                            fieldErrors[path] = []
                        }
                        fieldErrors[path].push(err.message)
                    }
                }

                result.errors.push({
                    row: rowNumber,
                    errors: fieldErrors,
                    data: record as Record<string, unknown>
                })
            }
        }

        return result
    } catch (error) {
        if (error instanceof CSVError) {
            throw error
        }
        throw new CSVError('Failed to parse CSV file. Please check the format.')
    }
}

export function generateCSV(buyers: Buyer[]): string {
    if (buyers.length === 0) {
        return stringify([CSV_HEADERS])
    }

    const data = buyers.map(buyer => ({
        fullName: buyer.fullName,
        email: buyer.email || '',
        phone: buyer.phone,
        city: transformEnumForCSV.city[buyer.city as keyof typeof transformEnumForCSV.city],
        propertyType: transformEnumForCSV.propertyType[buyer.propertyType as keyof typeof transformEnumForCSV.propertyType],
        bhk: buyer.bhk ? transformEnumForCSV.bhk[buyer.bhk as keyof typeof transformEnumForCSV.bhk] : '',
        purpose: transformEnumForCSV.purpose[buyer.purpose as keyof typeof transformEnumForCSV.purpose],
        budgetMin: buyer.budgetMin || '',
        budgetMax: buyer.budgetMax || '',
        timeline: transformEnumForCSV.timeline[buyer.timeline as keyof typeof transformEnumForCSV.timeline],
        source: transformEnumForCSV.source[buyer.source as keyof typeof transformEnumForCSV.source],
        notes: buyer.notes || '',
        tags: JSON.parse(buyer.tags || '[]').join(', '),
        status: transformEnumForCSV.status[buyer.status as keyof typeof transformEnumForCSV.status]
    }))

    return stringify(data, {
        header: true,
        columns: CSV_HEADERS
    })
}

export function validateCSVHeaders(csvContent: string): void {
    try {
        const lines = csvContent.split('\n')
        if (lines.length === 0) {
            throw new CSVError('CSV file is empty')
        }

        const headerLine = lines[0].trim()
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''))

        const requiredHeaders = ['fullName', 'phone', 'city', 'propertyType', 'purpose', 'timeline', 'source']
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))

        if (missingHeaders.length > 0) {
            throw new CSVError(`Missing required headers: ${missingHeaders.join(', ')}`)
        }
    } catch (error) {
        if (error instanceof CSVError) {
            throw error
        }
        throw new CSVError('Failed to validate CSV headers')
    }
}
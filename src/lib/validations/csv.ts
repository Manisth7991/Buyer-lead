import { z } from 'zod'
import { CitySchema, PropertyTypeSchema, BHKSchema, PurposeSchema, TimelineSchema, SourceSchema, StatusSchema } from './buyer'

// CSV Import Schema - all fields as strings since CSV parsing gives strings
export const CSVBuyerSchema = z.object({
    fullName: z.string().min(2).max(80).trim(),
    email: z.string().optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits').trim(),
    city: z.string().transform((val) => val.toUpperCase()).pipe(CitySchema),
    propertyType: z.string().transform((val) => val.toUpperCase()).pipe(PropertyTypeSchema),
    bhk: z.string().transform((val) => val.toUpperCase()).pipe(BHKSchema).optional().or(z.literal('')),
    purpose: z.string().transform((val) => val.toUpperCase()).pipe(PurposeSchema),
    budgetMin: z.string().transform((val) => val === '' ? undefined : parseInt(val)).pipe(z.number().int().positive().optional()),
    budgetMax: z.string().transform((val) => val === '' ? undefined : parseInt(val)).pipe(z.number().int().positive().optional()),
    timeline: z.string().transform((val) => val.toUpperCase().replace(/[-\s]/g, '_')).pipe(TimelineSchema),
    source: z.string().transform((val) => val.toUpperCase().replace(/[-\s]/g, '_')).pipe(SourceSchema),
    notes: z.string().max(1000).optional().or(z.literal('')),
    tags: z.string().transform((val) => JSON.stringify(val ? val.split(',').map(tag => tag.trim()) : [])),
    status: z.string().transform((val) => val.toUpperCase()).pipe(StatusSchema).default('NEW'),
}).refine((data) => {
    // BHK is required for Apartment and Villa
    if (['APARTMENT', 'VILLA'].includes(data.propertyType) && !data.bhk) {
        return false
    }
    return true
}, {
    message: 'BHK is required for Apartment and Villa properties',
    path: ['bhk']
}).refine((data) => {
    // Budget max must be >= budget min if both are provided
    if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
        return false
    }
    return true
}, {
    message: 'Maximum budget must be greater than or equal to minimum budget',
    path: ['budgetMax']
})

// CSV Export Headers
export const CSV_HEADERS = [
    'fullName',
    'email',
    'phone',
    'city',
    'propertyType',
    'bhk',
    'purpose',
    'budgetMin',
    'budgetMax',
    'timeline',
    'source',
    'notes',
    'tags',
    'status'
] as const

export type CSVBuyer = z.infer<typeof CSVBuyerSchema>

// Validation result for CSV import
export interface CSVValidationResult {
    valid: CSVBuyer[]
    errors: Array<{
        row: number
        errors: Record<string, string[]>
        data: Record<string, unknown>
    }>
}

// Transform enum values for display in CSV
export const transformEnumForCSV = {
    city: {
        CHANDIGARH: 'Chandigarh',
        MOHALI: 'Mohali',
        ZIRAKPUR: 'Zirakpur',
        PANCHKULA: 'Panchkula',
        OTHER: 'Other'
    },
    propertyType: {
        APARTMENT: 'Apartment',
        VILLA: 'Villa',
        PLOT: 'Plot',
        OFFICE: 'Office',
        RETAIL: 'Retail'
    },
    bhk: {
        STUDIO: 'Studio',
        ONE: '1',
        TWO: '2',
        THREE: '3',
        FOUR: '4'
    },
    purpose: {
        BUY: 'Buy',
        RENT: 'Rent'
    },
    timeline: {
        ZERO_TO_THREE_MONTHS: '0-3m',
        THREE_TO_SIX_MONTHS: '3-6m',
        MORE_THAN_SIX_MONTHS: '>6m',
        EXPLORING: 'Exploring'
    },
    source: {
        WEBSITE: 'Website',
        REFERRAL: 'Referral',
        WALK_IN: 'Walk-in',
        CALL: 'Call',
        OTHER: 'Other'
    },
    status: {
        NEW: 'New',
        QUALIFIED: 'Qualified',
        CONTACTED: 'Contacted',
        VISITED: 'Visited',
        NEGOTIATION: 'Negotiation',
        CONVERTED: 'Converted',
        DROPPED: 'Dropped'
    }
}
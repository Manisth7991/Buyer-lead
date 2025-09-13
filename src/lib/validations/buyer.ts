import { z } from 'zod'

// Enum schemas matching Prisma enums
export const CitySchema = z.enum(['CHANDIGARH', 'MOHALI', 'ZIRAKPUR', 'PANCHKULA', 'OTHER'])
export const PropertyTypeSchema = z.enum(['APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'RETAIL'])
export const BHKSchema = z.enum(['STUDIO', 'ONE', 'TWO', 'THREE', 'FOUR'])
export const PurposeSchema = z.enum(['BUY', 'RENT'])
export const TimelineSchema = z.enum(['ZERO_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'MORE_THAN_SIX_MONTHS', 'EXPLORING'])
export const SourceSchema = z.enum(['WEBSITE', 'REFERRAL', 'WALK_IN', 'CALL', 'OTHER'])
export const StatusSchema = z.enum(['NEW', 'QUALIFIED', 'CONTACTED', 'VISITED', 'NEGOTIATION', 'CONVERTED', 'DROPPED'])

// Type aliases for better DX
export type City = z.infer<typeof CitySchema>
export type PropertyType = z.infer<typeof PropertyTypeSchema>
export type BHK = z.infer<typeof BHKSchema>
export type Purpose = z.infer<typeof PurposeSchema>
export type Timeline = z.infer<typeof TimelineSchema>
export type Source = z.infer<typeof SourceSchema>
export type Status = z.infer<typeof StatusSchema>

// Phone validation - 10-15 digits
const phoneRegex = /^\d{10,15}$/

// Buyer validation schema
export const BuyerSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(80, 'Full name must be at most 80 characters')
        .trim(),

    email: z.string()
        .email('Invalid email format')
        .optional()
        .or(z.literal('')),

    phone: z.string()
        .regex(phoneRegex, 'Phone must be 10-15 digits')
        .trim(),

    city: CitySchema,

    propertyType: PropertyTypeSchema,

    bhk: BHKSchema.optional(),

    purpose: PurposeSchema,

    budgetMin: z.number()
        .int('Budget must be a whole number')
        .positive('Budget must be positive')
        .optional(),

    budgetMax: z.number()
        .int('Budget must be a whole number')
        .positive('Budget must be positive')
        .optional(),

    timeline: TimelineSchema,

    source: SourceSchema,

    status: StatusSchema.default('NEW'),

    notes: z.string()
        .max(1000, 'Notes must be at most 1000 characters')
        .optional()
        .or(z.literal('')),

    tags: z.string().default('[]'),
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

// Create buyer schema (without status)
export const CreateBuyerSchema = BuyerSchema.omit({ status: true })

// Update buyer schema (includes id and updatedAt for concurrency control)
export const UpdateBuyerSchema = z.object({
    id: z.string().cuid(),
    updatedAt: z.string().datetime(),
    fullName: z.string().min(2).max(80).trim(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10,15}$/).trim(),
    city: CitySchema,
    propertyType: PropertyTypeSchema,
    bhk: BHKSchema.optional(),
    purpose: PurposeSchema,
    budgetMin: z.number().int().positive().optional(),
    budgetMax: z.number().int().positive().optional(),
    timeline: TimelineSchema,
    source: SourceSchema,
    status: StatusSchema,
    notes: z.string().max(1000).optional().or(z.literal('')),
    tags: z.string().default('[]'),
}).refine((data) => {
    if (['APARTMENT', 'VILLA'].includes(data.propertyType) && !data.bhk) {
        return false
    }
    return true
}, {
    message: 'BHK is required for Apartment and Villa properties',
    path: ['bhk']
}).refine((data) => {
    if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
        return false
    }
    return true
}, {
    message: 'Maximum budget must be greater than or equal to minimum budget',
    path: ['budgetMax']
})

// Query/filter schema for listing buyers
export const BuyerFilterSchema = z.object({
    search: z.string().optional(),
    city: CitySchema.optional(),
    propertyType: PropertyTypeSchema.optional(),
    status: StatusSchema.optional(),
    timeline: TimelineSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['fullName', 'updatedAt', 'createdAt']).default('updatedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type BuyerFilter = z.infer<typeof BuyerFilterSchema>
export type CreateBuyer = z.infer<typeof CreateBuyerSchema>
export type UpdateBuyer = z.infer<typeof UpdateBuyerSchema>
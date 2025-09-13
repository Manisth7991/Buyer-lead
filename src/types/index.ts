// Define types manually to avoid Prisma import issues during build
export type Buyer = {
    id: string
    fullName: string
    phone: string
    email: string | null
    city: string
    propertyType: string
    bhk: string | null
    purpose: string
    timeline: string
    source: string
    status: string
    budgetMin: number | null
    budgetMax: number | null
    notes: string | null
    tags: string
    ownerId: string
    createdAt: Date
    updatedAt: Date
}

export type User = {
    id: string
    email: string | null
    name: string | null
    emailVerified: Date | null
    image: string | null
    createdAt: Date
    updatedAt: Date
}

export type BuyerHistory = {
    id: string
    buyerId: string
    action: string
    details: string | null
    changedById: string
    createdAt: Date
}

// Extended types with relationships
export type BuyerWithOwner = Buyer & {
    owner: User
    tags: string[] // Helper for working with JSON tags
}

export type BuyerWithHistory = Buyer & {
    owner: User
    history: (BuyerHistory & {
        changedBy: User
    })[]
    tags: string[] // Helper for working with JSON tags
}

// Pagination result type
export interface PaginatedResult<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// History diff type
export interface BuyerHistoryDiff {
    field: string
    oldValue: unknown
    newValue: unknown
}
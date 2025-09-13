import { CreateBuyer, UpdateBuyer, BuyerFilter } from '@/lib/validations/buyer'

// API response types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Client-side API functions
export class BuyersAPI {
    private static async fetchWithAuth(url: string, options: RequestInit = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }))
            throw new Error(error.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    static async getBuyers(filters: Partial<BuyerFilter> = {}) {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value))
            }
        })

        return this.fetchWithAuth(`/api/buyers?${params}`)
    }

    static async getBuyer(id: string) {
        return this.fetchWithAuth(`/api/buyers/${id}`)
    }

    static async createBuyer(data: CreateBuyer) {
        return this.fetchWithAuth('/api/buyers', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    static async updateBuyer(id: string, data: UpdateBuyer) {
        return this.fetchWithAuth(`/api/buyers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    static async deleteBuyer(id: string) {
        return this.fetchWithAuth(`/api/buyers/${id}`, {
            method: 'DELETE',
        })
    }

    static async importCSV(file: File) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/buyers/import', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }))
            throw new Error(error.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    static getExportUrl(filters: Partial<BuyerFilter> = {}) {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value))
            }
        })

        return `/api/buyers/export?${params}`
    }
}
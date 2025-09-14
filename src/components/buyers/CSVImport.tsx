'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface CSVRow {
    fullName: string
    phone: string
    email?: string
    city: string
    propertyType: string
    bhk?: string
    purpose: string
    timeline: string
    source: string
    budgetMin?: string
    budgetMax?: string
    notes?: string
    tags?: string
}

export function CSVImport() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [csvData, setCsvData] = useState<CSVRow[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})

    const parseCSV = (csvText: string): CSVRow[] => {
        const lines = csvText.split('\n').filter(line => line.trim())
        if (lines.length === 0) return []

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const rows: CSVRow[] = []

        for (let i = 1; i < lines.length && i <= 200; i++) { // Max 200 rows
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
            const row: any = {}

            headers.forEach((header, index) => {
                const value = values[index] || ''
                switch (header.toLowerCase()) {
                    case 'fullname':
                    case 'full_name':
                    case 'name':
                        row.fullName = value
                        break
                    case 'phone':
                    case 'phone_number':
                        row.phone = value
                        break
                    case 'email':
                        row.email = value
                        break
                    case 'city':
                        row.city = value.toUpperCase()
                        break
                    case 'propertytype':
                    case 'property_type':
                    case 'type':
                        row.propertyType = value.toUpperCase()
                        break
                    case 'bhk':
                        row.bhk = value.toUpperCase().replace(' ', '_')
                        break
                    case 'purpose':
                        row.purpose = value.toUpperCase()
                        break
                    case 'timeline':
                        row.timeline = value.toUpperCase().replace(' ', '_')
                        break
                    case 'source':
                        row.source = value.toUpperCase()
                        break
                    case 'budgetmin':
                    case 'budget_min':
                    case 'min_budget':
                        row.budgetMin = value
                        break
                    case 'budgetmax':
                    case 'budget_max':
                    case 'max_budget':
                        row.budgetMax = value
                        break
                    case 'notes':
                        row.notes = value
                        break
                    case 'tags':
                        row.tags = value
                        break
                }
            })

            if (row.fullName && row.phone) {
                rows.push(row)
            }
        }

        return rows
    }

    const validateRow = (row: CSVRow): string[] => {
        const errors: string[] = []

        if (!row.fullName || row.fullName.length < 2) {
            errors.push('Full name is required (min 2 characters)')
        }

        if (!row.phone || !/^\d{10,15}$/.test(row.phone)) {
            errors.push('Valid phone number is required (10-15 digits)')
        }

        if (!['CHANDIGARH', 'MOHALI', 'ZIRAKPUR', 'PANCHKULA', 'OTHER'].includes(row.city)) {
            errors.push('City must be one of: CHANDIGARH, MOHALI, ZIRAKPUR, PANCHKULA, OTHER')
        }

        if (!['APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'RETAIL'].includes(row.propertyType)) {
            errors.push('Property type must be one of: APARTMENT, VILLA, PLOT, OFFICE, RETAIL')
        }

        if (['APARTMENT', 'VILLA'].includes(row.propertyType) && !row.bhk) {
            errors.push('BHK is required for apartments and villas')
        }

        if (!['BUY', 'RENT'].includes(row.purpose)) {
            errors.push('Purpose must be BUY or RENT')
        }

        if (!['ZERO_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'MORE_THAN_SIX_MONTHS', 'EXPLORING'].includes(row.timeline)) {
            errors.push('Timeline must be one of: ZERO_TO_THREE_MONTHS, THREE_TO_SIX_MONTHS, MORE_THAN_SIX_MONTHS, EXPLORING')
        }

        if (!['WEBSITE', 'REFERRAL', 'WALK_IN', 'CALL', 'OTHER'].includes(row.source)) {
            errors.push('Source must be one of: WEBSITE, REFERRAL, WALK_IN, CALL, OTHER')
        }

        return errors
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (!selectedFile) return

        if (!selectedFile.name.endsWith('.csv')) {
            setErrors(['Please select a CSV file'])
            return
        }

        setFile(selectedFile)
        setIsUploading(true)
        setErrors([])
        setValidationErrors({})

        try {
            const text = await selectedFile.text()
            const data = parseCSV(text)

            if (data.length === 0) {
                setErrors(['No valid data found in CSV file'])
                return
            }

            if (data.length > 200) {
                setErrors(['CSV file contains more than 200 rows. Only first 200 rows will be processed.'])
            }

            // Validate each row
            const newValidationErrors: Record<number, string[]> = {}
            data.forEach((row, index) => {
                const rowErrors = validateRow(row)
                if (rowErrors.length > 0) {
                    newValidationErrors[index] = rowErrors
                }
            })

            setCsvData(data)
            setValidationErrors(newValidationErrors)
        } catch (error) {
            console.error('Error parsing CSV:', error)
            setErrors(['Failed to parse CSV file. Please check the format.'])
        } finally {
            setIsUploading(false)
        }
    }

    const handleImport = async () => {
        if (Object.keys(validationErrors).length > 0) {
            setErrors(['Please fix all validation errors before importing'])
            return
        }

        setIsImporting(true)
        try {
            // Prepare data for API
            const importData = csvData.map(row => ({
                fullName: row.fullName,
                phone: row.phone,
                email: row.email || undefined,
                city: row.city,
                propertyType: row.propertyType,
                bhk: row.bhk || undefined,
                purpose: row.purpose,
                timeline: row.timeline,
                source: row.source,
                budgetMin: row.budgetMin ? parseInt(row.budgetMin) : undefined,
                budgetMax: row.budgetMax ? parseInt(row.budgetMax) : undefined,
                notes: row.notes || undefined,
                tags: row.tags || '[]'
            }))

            const response = await fetch('/api/buyers/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ buyers: importData }),
            })

            if (!response.ok) {
                throw new Error('Import failed')
            }

            const result = await response.json()
            alert(`Successfully imported ${result.imported} buyers`)
            router.push('/buyers')
        } catch (error) {
            console.error('Import failed:', error)
            setErrors(['Import failed. Please try again.'])
        } finally {
            setIsImporting(false)
        }
    }

    const downloadTemplate = () => {
        const template = `fullName,phone,email,city,propertyType,bhk,purpose,timeline,source,budgetMin,budgetMax,notes,tags
John Doe,9876543210,john@example.com,CHANDIGARH,APARTMENT,TWO_BHK,BUY,ZERO_TO_THREE_MONTHS,WEBSITE,5000000,7000000,Looking for 2BHK apartment,"['urgent','family']"
Jane Smith,9876543211,jane@example.com,MOHALI,VILLA,THREE_BHK,BUY,THREE_TO_SIX_MONTHS,REFERRAL,8000000,12000000,Needs garden space,"['luxury','garden']"`

        const blob = new Blob([template], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'buyers_template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">CSV Import Instructions</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Download the template below to see the required format</li>
                    <li>• Maximum 200 rows per import</li>
                    <li>• Required fields: fullName, phone, city, propertyType, purpose, timeline, source</li>
                    <li>• BHK is required for APARTMENT and VILLA property types</li>
                    <li>• Budget fields should be numbers (without currency symbols)</li>
                    <li>• Tags should be in JSON array format: [&quot;tag1&quot;, &quot;tag2&quot;]</li>
                </ul>

                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={downloadTemplate}
                >
                    Download Template
                </Button>
            </div>

            {/* File Upload */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h3>

                <div className="space-y-4">
                    <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={isUploading || isImporting}
                    />

                    {isUploading && (
                        <p className="text-sm text-gray-600">Processing CSV file...</p>
                    )}

                    {errors.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                            {errors.map((error, index) => (
                                <p key={index}>• {error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview */}
            {csvData.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Preview ({csvData.length} rows)
                        </h3>

                        <Button
                            onClick={handleImport}
                            disabled={isImporting || Object.keys(validationErrors).length > 0}
                        >
                            {isImporting ? 'Importing...' : 'Import All'}
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Property Type</TableHead>
                                    <TableHead>BHK</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead>Timeline</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {csvData.slice(0, 10).map((row, index) => {
                                    const hasErrors = validationErrors[index]?.length > 0
                                    return (
                                        <TableRow key={index} className={hasErrors ? 'bg-red-50' : ''}>
                                            <TableCell>
                                                {row.fullName}
                                                {hasErrors && (
                                                    <div className="text-xs text-red-600 mt-1">
                                                        {validationErrors[index].map((error, i) => (
                                                            <div key={i}>• {error}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell>{row.propertyType}</TableCell>
                                            <TableCell>{row.bhk}</TableCell>
                                            <TableCell>{row.purpose}</TableCell>
                                            <TableCell>{row.timeline}</TableCell>
                                            <TableCell>
                                                {hasErrors ? (
                                                    <span className="text-red-600 text-sm">Error</span>
                                                ) : (
                                                    <span className="text-green-600 text-sm">Valid</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                        {csvData.length > 10 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Showing first 10 rows. Total: {csvData.length} rows.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
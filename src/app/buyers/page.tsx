import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BuyerFilterSchema } from '@/lib/validations/buyer'
import { BuyersTable } from '@/components/buyers/BuyersTable'
import { BuyersFilters } from '@/components/buyers/BuyersFilters'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'

interface BuyersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Await searchParams for Next.js 15
  const searchParamsResolved = await searchParams

  // Validate and parse search parameters
  const queryParams: Record<string, string> = {}
  Object.entries(searchParamsResolved).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryParams[key] = value
    } else if (Array.isArray(value)) {
      queryParams[key] = value[0] || ''
    }
  })

  const validatedParams = BuyerFilterSchema.parse(queryParams)

  // Build where clause for filtering
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

  // Fetch buyers with pagination
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

  // Transform buyers data for client
  const transformedBuyers = buyers.map((buyer: any) => ({
    ...buyer,
    tags: JSON.parse(buyer.tags || '[]')
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Leads</h1>
              <p className="text-lg text-gray-600">
                Manage your buyer leads and track their progress through the sales pipeline.
              </p>
            </div>
            <div className="mt-6 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/buyers/new" className="w-full sm:w-auto">
                  <Button className="w-full">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add New Lead
                  </Button>
                </Link>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/buyers/import" className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full">
                      <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Import CSV</span>
                      <span className="sm:hidden">Import</span>
                    </Button>
                  </Link>
                  <a
                    href={`/api/buyers/export?${new URLSearchParams(queryParams).toString()}`}
                    download
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="outline" className="w-full">
                      <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Export CSV</span>
                      <span className="sm:hidden">Export</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{buyers.filter((b: any) => ['NEW', 'CONTACTED', 'QUALIFIED', 'VISITED', 'NEGOTIATION'].includes(b.status)).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-semibold text-gray-900">{buyers.filter((b: any) => b.status === 'CONVERTED').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Page</p>
                <p className="text-2xl font-semibold text-gray-900">{buyers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BuyersFilters initialFilters={validatedParams} />
        </div>

        {/* Results summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            Showing <span className="font-medium text-gray-900">{(validatedParams.page - 1) * validatedParams.limit + 1}</span> to{' '}
            <span className="font-medium text-gray-900">{Math.min(validatedParams.page * validatedParams.limit, total)}</span> of{' '}
            <span className="font-medium text-gray-900">{total}</span> results
          </div>
        </div>

        {/* Table */}
        <div className="mb-8">
          <BuyersTable
            buyers={transformedBuyers}
            currentUserId={session.user.id}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={validatedParams.page}
              totalPages={totalPages}
              onPageChange={(page) => {
                const params = new URLSearchParams(queryParams)
                params.set('page', page.toString())
                window.location.href = `/buyers?${params.toString()}`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
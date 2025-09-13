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

  // Search across name, phone, and email
  if (validatedParams.search) {
    where.OR = [
      { fullName: { contains: validatedParams.search, mode: 'insensitive' } },
      { phone: { contains: validatedParams.search } },
      { email: { contains: validatedParams.search, mode: 'insensitive' } },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your buyer leads and track their progress.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
              <Link href="/buyers/new">
                <Button>Add New Lead</Button>
              </Link>
              <Link href="/buyers/import">
                <Button variant="outline">Import CSV</Button>
              </Link>
              <a
                href={`/api/buyers/export?${new URLSearchParams(queryParams).toString()}`}
                download
              >
                <Button variant="outline">Export CSV</Button>
              </a>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6">
            <BuyersFilters initialFilters={validatedParams} />
          </div>

          {/* Results summary */}
          <div className="mt-6 text-sm text-gray-700">
            Showing {(validatedParams.page - 1) * validatedParams.limit + 1} to{' '}
            {Math.min(validatedParams.page * validatedParams.limit, total)} of {total} results
          </div>

          {/* Table */}
          <div className="mt-4">
            <BuyersTable
              buyers={transformedBuyers}
              currentUserId={session.user.id}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
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
    </div>
  )
}
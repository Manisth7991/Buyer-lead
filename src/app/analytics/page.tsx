import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
    ChartBarIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    CalendarIcon
} from '@heroicons/react/24/outline'

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    // Fetch analytics data
    const [
        totalBuyers,
        newBuyersThisMonth,
        closedDeals,
        activeLeads,
        buyersByStatus,
        buyersByCity,
        recentBuyers
    ] = await Promise.all([
        // Total buyers
        prisma.buyer.count(),

        // New buyers this month
        prisma.buyer.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        }),

        // Closed deals
        prisma.buyer.count({
            where: { status: 'CONVERTED' }
        }),

        // Active leads
        prisma.buyer.count({
            where: {
                status: {
                    in: ['NEW', 'CONTACTED', 'QUALIFIED', 'VISITED', 'NEGOTIATION']
                }
            }
        }),

        // Buyers by status
        prisma.buyer.groupBy({
            by: ['status'],
            _count: { status: true }
        }),

        // Buyers by city
        prisma.buyer.groupBy({
            by: ['city'],
            _count: { city: true }
        }),

        // Recent buyers
        prisma.buyer.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: {
                    select: { name: true, email: true }
                }
            }
        })
    ])

    // Calculate conversion rate
    const conversionRate = totalBuyers > 0 ? (closedDeals / totalBuyers * 100).toFixed(1) : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-lg text-gray-600">
                                Track your sales performance and buyer insights.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <UsersIcon className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalBuyers}</p>
                                <div className="flex items-center mt-1">
                                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-xs text-green-600">{newBuyersThisMonth} this month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Closed Deals</p>
                                <p className="text-2xl font-semibold text-gray-900">{closedDeals}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500">{conversionRate}% conversion rate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <ClockIcon className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                                <p className="text-2xl font-semibold text-gray-900">{activeLeads}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500">In pipeline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-semibold text-gray-900">{newBuyersThisMonth}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500">New leads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Status Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyers by Status</h3>
                        <div className="space-y-3">
                            {buyersByStatus.map((item: any) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item._count.status / totalBuyers) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8 text-right">
                                            {item._count.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* City Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyers by City</h3>
                        <div className="space-y-3">
                            {buyersByCity.map((item: any) => (
                                <div key={item.city} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.city}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item._count.city / totalBuyers) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8 text-right">
                                            {item._count.city}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Buyers</h3>
                    <div className="space-y-4">
                        {recentBuyers.map((buyer: any) => (
                            <div key={buyer.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm">
                                            {buyer.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{buyer.fullName}</p>
                                        <p className="text-xs text-gray-500">{buyer.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-700">{buyer.city}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(buyer.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
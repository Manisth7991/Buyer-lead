'use client'

import { motion } from 'framer-motion'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const statusConfig = {
    NEW: {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
        dot: 'bg-blue-500'
    },
    CONTACTED: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
        dot: 'bg-yellow-500'
    },
    QUALIFIED: {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700',
        dot: 'bg-emerald-500'
    },
    VISITED: {
        color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700',
        dot: 'bg-purple-500'
    },
    NEGOTIATION: {
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700',
        dot: 'bg-orange-500'
    },
    CONVERTED: {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
        dot: 'bg-green-500'
    },
    DROPPED: {
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
        dot: 'bg-red-500'
    },
    // Timeline statuses
    ZERO_TO_THREE_MONTHS: {
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
        dot: 'bg-red-500'
    },
    THREE_TO_SIX_MONTHS: {
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700',
        dot: 'bg-orange-500'
    },
    MORE_THAN_SIX_MONTHS: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
        dot: 'bg-yellow-500'
    },
    EXPLORING: {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
        dot: 'bg-blue-500'
    }
}

const sizeConfig = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW
    const sizeClasses = sizeConfig[size]

    // Format the display text
    const formatStatus = (status: string) => {
        switch (status) {
            case 'ZERO_TO_THREE_MONTHS':
                return '0-3 Months'
            case 'THREE_TO_SIX_MONTHS':
                return '3-6 Months'
            case 'MORE_THAN_SIX_MONTHS':
                return '6+ Months'
            default:
                return status.replace(/_/g, ' ')
        }
    }

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.color} ${sizeClasses} ${className}
      `}
        >
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {formatStatus(status)}
        </motion.span>
    )
}

// Export the status configuration for consistent styling elsewhere
export { statusConfig }
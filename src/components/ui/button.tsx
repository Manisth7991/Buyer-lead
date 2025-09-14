import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-blue-500 text-white hover:bg-blue-600 shadow-sm': variant === 'default',
                        'bg-red-500 text-white hover:bg-red-600 shadow-sm': variant === 'destructive',
                        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm': variant === 'outline',
                        'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
                        'text-gray-700 hover:bg-gray-50': variant === 'ghost',
                        'text-blue-500 underline-offset-4 hover:underline': variant === 'link',
                    },
                    {
                        'h-10 px-4 py-2': size === 'default',
                        'h-9 rounded-lg px-3': size === 'sm',
                        'h-11 rounded-xl px-8': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
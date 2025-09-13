import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    required?: boolean
}

export function FormTextarea({ label, error, required, className, ...props }: FormTextareaProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
                className={cn(error && 'border-red-500', className)}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
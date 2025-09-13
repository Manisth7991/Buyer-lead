import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps {
    label: string
    error?: string
    required?: boolean
    children: React.ReactNode
    className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean
}

export function FormInput({ label, error, required, className, ...props }: FormInputProps) {
    return (
        <FormField label={label} error={error} required={required}>
            <Input
                className={cn(error && 'border-red-500', className)}
                {...props}
            />
        </FormField>
    )
}
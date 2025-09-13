import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    required?: boolean
    options: { value: string; label: string }[]
}

export function FormSelect({ label, error, required, options, className, ...props }: FormSelectProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
                className={cn(error && 'border-red-500', className)}
                {...props}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
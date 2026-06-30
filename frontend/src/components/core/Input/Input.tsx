import { cn } from '@/lib/utils'
import { ShieldAlert } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes } from 'react'

type Props = {
	error?: string
	className?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
	({ error, className, ...props }, ref) => {
		return (
			<div className='w-full'>
				<div className='relative w-full'>
				<input
					ref={ref}
					className={cn(
						'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100',
						error
							? 'border-red-300 pr-10 focus:border-red-500'
							: 'border-gray-200 focus:border-purple-500',
						className
					)}
					{...props}
				/>
				{error && (
					<ShieldAlert
						className='absolute right-3 top-1/2 -translate-y-1/2 text-red-500'
						size={18}
					/>
				)}
				</div>
				{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
			</div>
		)
	}
)

Input.displayName = 'Input'

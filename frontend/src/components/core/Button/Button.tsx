import { type ButtonVariant } from '@/types/button'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, ReactNode } from 'react'

export type Props = {
	children: ReactNode
	variant?: ButtonVariant
	isLoading?: boolean
	loadingText?: string
	className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
	children,
	variant = 'primary',
	isLoading,
	loadingText,
	className,
	disabled,
	...props
}: Props) => {
	return (
		<button
			disabled={disabled || isLoading}
			className={cn(
				'inline-flex items-center justify-center gap-2 rounded-lg h-10 px-5 hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
				variant === 'primary' &&
					'bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200',
				variant === 'secondary' &&
					'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-colors duration-200',
				className
			)}
			{...props}
		>
			{isLoading ? loadingText : children}
		</button>
	)
}

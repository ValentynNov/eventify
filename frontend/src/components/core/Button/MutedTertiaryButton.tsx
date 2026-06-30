import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { type ButtonHTMLAttributes } from 'react'

export type Props = {
	icon: LucideIcon
	className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const MutedTertiaryButton = ({
	icon: Icon,
	className,
	type = 'button',
	...props
}: Props) => {
	return (
		<button
			type={type}
			className={cn(
				'inline-flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900',
				'disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer',
				className
			)}
			{...props}
		>
			<Icon className='size-5' aria-hidden />
		</button>
	)
}

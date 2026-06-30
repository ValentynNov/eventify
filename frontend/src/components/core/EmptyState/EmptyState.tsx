import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
	icon: LucideIcon
	title: string
	description?: string
	action?: ReactNode
	className?: string
}

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
	className
}: Props) => (
	<div
		className={cn(
			'flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center',
			className
		)}
	>
		<div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600'>
			<Icon className='h-7 w-7' aria-hidden />
		</div>
		<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
		{description ? (
			<p className='mt-2 max-w-md text-sm text-gray-500'>{description}</p>
		) : null}
		{action ? <div className='mt-6'>{action}</div> : null}
	</div>
)

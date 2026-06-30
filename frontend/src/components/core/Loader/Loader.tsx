import { cn } from '@/lib/utils'

type Props = {
	className?: string
	label?: string
	spinClassName?: string
}

export const Loader = ({ className, label, spinClassName }: Props) => (
	<div
		className={cn('flex flex-col items-center justify-center gap-3', className)}
		role='status'
		aria-live='polite'
	>
		<div
			className={cn(
				'h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600',
				spinClassName
			)}
		/>
		{label ? <p className='text-sm text-gray-500'>{label}</p> : null}
	</div>
)

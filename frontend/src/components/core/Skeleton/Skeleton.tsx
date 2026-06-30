import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export const Skeleton = ({ className, ...props }: Props) => (
	<div
		className={cn('animate-pulse rounded-lg bg-gray-200', className)}
		{...props}
	/>
)

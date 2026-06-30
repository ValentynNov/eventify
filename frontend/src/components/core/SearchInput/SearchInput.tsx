'use client'

import { Input } from '@/components/core/Input/Input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof Input> & {
	wrapperClassName?: string
}

export const SearchInput = ({
	className,
	wrapperClassName,
	...props
}: Props) => (
	<div className={cn('relative w-full', wrapperClassName)}>
		<Input
			className={cn('relative z-0 rounded-xl py-3 pl-11', className)}
			{...props}
		/>
		<Search
			className='pointer-events-none absolute left-4 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 text-gray-400'
			strokeWidth={2}
			aria-hidden
		/>
	</div>
)

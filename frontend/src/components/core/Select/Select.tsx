import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'

export type SelectOption = { value: string; label: string }

const fieldClassName =
	'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50'

type Props = {
	id: string
	label: string
	options: SelectOption[]
	emptyLabel?: string
	allowEmpty?: boolean
	className?: string
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children'>

export const Select = ({
	id,
	label,
	options,
	emptyLabel = 'Усі',
	allowEmpty = true,
	className,
	...selectProps
}: Props) => (
	<div className={cn('min-w-0', className)}>
		<label
			htmlFor={id}
			className='mb-2 block text-sm font-medium text-gray-900'
		>
			{label}
		</label>
		<select
			id={id}
			className={fieldClassName}
			{...selectProps}
		>
			{allowEmpty ? <option value=''>{emptyLabel}</option> : null}
			{options.map(o => (
				<option
					key={o.value}
					value={o.value}
				>
					{o.label}
				</option>
			))}
		</select>
	</div>
)

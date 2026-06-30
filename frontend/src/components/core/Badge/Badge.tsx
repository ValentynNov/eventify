import { cn } from '@/lib/utils'
import type { RegistrationStatusDto } from '@/types/api'
import type { ReactNode } from 'react'

type BadgeProps = {
	children: ReactNode
	className?: string
}

export const Badge = ({ children, className }: BadgeProps) => (
	<span
		className={cn(
			'inline-flex rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700',
			className
		)}
	>
		{children}
	</span>
)

const statusStyles: Record<RegistrationStatusDto, string> = {
	Approved: 'text-green-600 bg-green-100',
	Pending: 'bg-amber-100 text-amber-800',
	Rejected: 'text-red-600 bg-red-100'
}

type RegistrationBadgeProps = {
	status: RegistrationStatusDto | string
	className?: string
}

export const RegistrationBadge = ({
	status,
	className
}: RegistrationBadgeProps) => {
	const key = status as RegistrationStatusDto
	const styles = statusStyles[key] ?? 'bg-gray-100 text-gray-700'
	const labelUa: Record<string, string> = {
		Pending: 'Очікує',
		Approved: 'Підтверджено',
		Rejected: 'Відхилено'
	}

	return (
		<span
			className={cn(
				'inline-flex rounded-full px-3 py-0.5 text-xs font-semibold',
				styles,
				className
			)}
		>
			{labelUa[status] ?? status}
		</span>
	)
}

import { type NavItem } from '@/types/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = NavItem & {
	layout?: 'horizontal' | 'vertical'
}

const NavItem = ({ label, path, isActive, layout = 'horizontal' }: Props) => (
	<Link
		href={path}
		className={cn(
			'text-gray-500 font-medium transition-colors duration-300 hover:text-purple-600',
			layout === 'horizontal' ?
				isActive && 'text-purple-600 font-semibold'
			:	isActive && 'rounded-xl bg-purple-50 px-3 py-2 text-purple-700',
			layout !== 'horizontal' && !isActive && 'px-3 py-2 text-base'
		)}
	>
		{label}
	</Link>
)

export default NavItem

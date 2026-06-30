'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINK } from '@/const/navigation'
import { useAuth } from '@/contexts/authContext'
import { isAdminUser } from '@/lib/auth/isAdmin'
import NavItem from './NavItem'
import { cn } from '@/lib/utils'

type Props = {
	layout?: 'horizontal' | 'vertical'
}

const ADMIN_NAV = { label: 'Адмін', path: '/admin/registrations' } as const

const NavItemList = ({ layout = 'horizontal' }: Props) => {
	const pathname = usePathname()
	const auth = useAuth()
	const links = isAdminUser(auth.user?.role)
		? [...NAV_LINK, ADMIN_NAV]
		: NAV_LINK

	return (
		<div className='w-full'>
			<ul
				className={cn(
					'flex gap-4',
					layout === 'horizontal'
						? 'items-center'
						: 'flex-col items-stretch gap-6'
				)}
			>
				{links.map(({ label, path }) => {
					const normalized = pathname ?? ''
					const active =
						path === '/' ?
							normalized === '/'
						:	normalized === path ||
							normalized.startsWith(`${path}/`)

					return (
						<li key={path}>
							<NavItem
								label={label}
								path={path}
								isActive={active}
								layout={layout}
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default NavItemList

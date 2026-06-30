'use client'

import { Loader } from '@/components/core/Loader/Loader'
import { useAuth } from '@/contexts/authContext'
import { sanitizeReturnUrl } from '@/lib/auth/returnUrl'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, isHydrated } = useAuth()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (!isHydrated) return
		if (!isAuthenticated) {
			const redirect =
				sanitizeReturnUrl(pathname, '/registrations') ?? '/registrations'
			const qs = new URLSearchParams()
			qs.set('auth', 'login')
			qs.set('returnUrl', redirect)
			router.replace(`/?${qs.toString()}`)
		}
	}, [isAuthenticated, isHydrated, pathname, router])

	if (!isHydrated) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<Loader label='Перевірка сесії…' />
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<p className='text-gray-500'>Перенаправлення на вхід…</p>
			</div>
		)
	}

	return children
}

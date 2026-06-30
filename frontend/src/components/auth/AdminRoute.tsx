'use client'

import { Loader } from '@/components/core/Loader/Loader'
import { useAuth } from '@/contexts/authContext'
import { isAdminUser } from '@/lib/auth/isAdmin'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

export const AdminRoute = ({ children }: { children: ReactNode }) => {
	const { user, isHydrated } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isHydrated) return
		if (!isAdminUser(user?.role)) {
			router.replace('/')
		}
	}, [isHydrated, router, user?.role])

	if (!isHydrated) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<Loader label='Перевірка доступу…' />
			</div>
		)
	}

	if (!isAdminUser(user?.role)) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<p className='text-gray-500'>Перенаправлення…</p>
			</div>
		)
	}

	return children
}

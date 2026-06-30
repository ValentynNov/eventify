'use client'

import { useAuthModal } from '@/contexts/authModalContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const AuthSearchParamsBridge = () => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const { openLogin, openRegister } = useAuthModal()

	useEffect(() => {
		const auth = searchParams.get('auth')
		if (auth !== 'login' && auth !== 'register') return

		const returnUrl = searchParams.get('returnUrl')
		if (auth === 'login') openLogin(returnUrl)
		else openRegister(returnUrl)

		const next = new URLSearchParams(searchParams.toString())
		next.delete('auth')
		next.delete('returnUrl')
		const qs = next.toString()
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
	}, [openLogin, openRegister, pathname, router, searchParams])

	return null
}

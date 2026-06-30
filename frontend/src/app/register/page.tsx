'use client'

import { Loader } from '@/components/core/Loader/Loader'
import { sanitizeReturnUrl } from '@/lib/auth/returnUrl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const RegisterRedirectInner = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const returnUrl = sanitizeReturnUrl(searchParams.get('returnUrl'))
		const qs = new URLSearchParams()
		qs.set('auth', 'register')
		if (returnUrl) {
			qs.set('returnUrl', returnUrl)
		}
		router.replace(`/?${qs.toString()}`)
	}, [router, searchParams])

	return (
		<div className='flex min-h-[40vh] items-center justify-center px-4'>
			<Loader label='Перенаправлення…' />
		</div>
	)
}

const RegisterRedirectPage = () => (
	<Suspense
		fallback={
			<div className='flex min-h-[40vh] items-center justify-center px-4'>
				<Loader label='Завантаження…' />
			</div>
		}
	>
		<RegisterRedirectInner />
	</Suspense>
)

export default RegisterRedirectPage

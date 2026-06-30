'use client'

import { AuthProvider } from '@/contexts/authContext'
import { AuthModalProvider } from '@/contexts/authModalContext'
import { QueryProvider } from '@/providers/queryProvider'
import { type ReactNode, useEffect } from 'react'

export const AppProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		if (document.querySelector('dialog[open]')) return
		document.documentElement.style.overflow = ''
		document.body.style.overflow = ''
		document.body.style.paddingRight = ''
	}, [])

	return (
		<QueryProvider>
			<AuthProvider>
				<AuthModalProvider>{children}</AuthModalProvider>
			</AuthProvider>
		</QueryProvider>
	)
}

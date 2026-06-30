'use client'

import { AuthModal } from '@/features/auth/components/AuthModal'
import { sanitizeReturnUrl } from '@/lib/auth/returnUrl'
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode
} from 'react'

export type AuthModalView = 'login' | 'register'

type AuthModalContextValue = {
	isOpen: boolean
	view: AuthModalView
	returnUrl: string | null
	openLogin: (returnUrl?: string | null) => void
	openRegister: (returnUrl?: string | null) => void
	switchToRegister: () => void
	switchToLogin: () => void
	close: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [view, setView] = useState<AuthModalView>('login')
	const [returnUrl, setReturnUrl] = useState<string | null>(null)

	const openLogin = useCallback((url?: string | null) => {
		setReturnUrl(sanitizeReturnUrl(url))
		setView('login')
		setIsOpen(true)
	}, [])

	const openRegister = useCallback((url?: string | null) => {
		setReturnUrl(sanitizeReturnUrl(url))
		setView('register')
		setIsOpen(true)
	}, [])

	const switchToRegister = useCallback(() => setView('register'), [])
	const switchToLogin = useCallback(() => setView('login'), [])

	const close = useCallback(() => {
		setIsOpen(false)
		setView('login')
		setReturnUrl(null)
	}, [])

	const value = useMemo(
		() =>
			({
				isOpen,
				view,
				returnUrl,
				openLogin,
				openRegister,
				switchToRegister,
				switchToLogin,
				close
			}) satisfies AuthModalContextValue,
		[
			close,
			isOpen,
			openLogin,
			openRegister,
			returnUrl,
			switchToLogin,
			switchToRegister,
			view
		]
	)

	return (
		<AuthModalContext.Provider value={value}>
			{children}
			<AuthModal />
		</AuthModalContext.Provider>
	)
}

export const useAuthModal = (): AuthModalContextValue => {
	const ctx = useContext(AuthModalContext)
	if (!ctx) {
		throw new Error('useAuthModal must be used within AuthModalProvider')
	}
	return ctx
}

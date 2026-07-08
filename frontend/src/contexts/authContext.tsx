'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode
} from 'react'
import type { AuthUserDto } from '@/types/api'
import { revokeRefreshRequest } from '@/lib/api/authApi'
import { clearAuthStorage, getStoredUser, persistAuthUser } from '@/lib/tokenStorage'

type AuthContextValue = {
	user: AuthUserDto | null
	isAuthenticated: boolean
	isHydrated: boolean
	setSession: (response: AuthUserDto) => void
	clearSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUserDto | null>(null)
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		setUser(getStoredUser())
		setHydrated(true)
	}, [])

	const setSession = useCallback((response: AuthUserDto) => {
		const nextUser: AuthUserDto = {
			id: response.id,
			firebaseUid: response.firebaseUid,
			username: response.username,
			email: response.email,
			role: response.role
		}
		persistAuthUser(nextUser)
		setUser(nextUser)
	}, [])

	const clearSession = useCallback(async () => {
		try {
			await revokeRefreshRequest()
		} catch {
			// Local logout should still complete if Firebase sign-out fails.
		}
		clearAuthStorage()
		setUser(null)
	}, [])

	const value = useMemo(
		() =>
			({
				user,
				isAuthenticated: Boolean(user),
				isHydrated: hydrated,
				setSession,
				clearSession
			}) satisfies AuthContextValue,
		[clearSession, hydrated, setSession, user]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
	const ctx = useContext(AuthContext)
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return ctx
}

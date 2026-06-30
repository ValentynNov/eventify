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
import type { AuthResponseDto, AuthUserDto } from '@/types/api'
import { revokeRefreshRequest } from '@/lib/api/authApi'
import {
	clearAuthStorage,
	getStoredAccessToken,
	getStoredUser,
	persistAuth
} from '@/lib/tokenStorage'

type AuthContextValue = {
	user: AuthUserDto | null
	isAuthenticated: boolean
	isHydrated: boolean
	setSession: (response: AuthResponseDto) => void
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

	const setSession = useCallback((response: AuthResponseDto) => {
		const nextUser: AuthUserDto = {
			username: response.username,
			email: response.email,
			role: response.role
		}
		persistAuth({
			accessToken: response.token,
			refreshToken: response.refreshToken,
			user: nextUser
		})
		setUser(nextUser)
	}, [])

	const clearSession = useCallback(async () => {
		const token = getStoredAccessToken()
		if (token) {
			try {
				await revokeRefreshRequest()
			} catch {
				// Local logout should still complete if token revocation fails.
			}
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

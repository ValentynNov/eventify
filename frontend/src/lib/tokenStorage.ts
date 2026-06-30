import type { AuthUserDto } from '@/types/api'

const ACCESS = 'eventify_access_token'
const REFRESH = 'eventify_refresh_token'
const USER = 'eventify_user'

export const getStoredAccessToken = (): string | null => {
	if (typeof window === 'undefined') return null
	return window.localStorage.getItem(ACCESS)
}

export const getStoredRefreshToken = (): string | null => {
	if (typeof window === 'undefined') return null
	return window.localStorage.getItem(REFRESH)
}

export const getStoredUser = (): AuthUserDto | null => {
	if (typeof window === 'undefined') return null
	const raw = window.localStorage.getItem(USER)
	if (!raw) return null
	try {
		return JSON.parse(raw) as AuthUserDto
	} catch {
		return null
	}
}

export const persistAuth = (tokens: {
	accessToken: string
	refreshToken: string
	user: AuthUserDto
}): void => {
	window.localStorage.setItem(ACCESS, tokens.accessToken)
	window.localStorage.setItem(REFRESH, tokens.refreshToken)
	window.localStorage.setItem(USER, JSON.stringify(tokens.user))
}

export const clearAuthStorage = (): void => {
	window.localStorage.removeItem(ACCESS)
	window.localStorage.removeItem(REFRESH)
	window.localStorage.removeItem(USER)
}

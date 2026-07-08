import { apiClient } from '@/lib/api/client'
import { clearAuthStorage, persistAuth } from '@/lib/tokenStorage'
import type { CurrentUserDto } from '@/types/api'

type FirebaseAuthResponse = {
	idToken: string
	refreshToken: string
	email: string
	displayName?: string
}

const getFirebaseApiKey = (): string => {
	const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
	if (!apiKey) {
		throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is not configured')
	}
	return apiKey
}

const firebaseAuthRequest = async (
	path: 'signInWithPassword' | 'signUp',
	body: { email: string; password: string; displayName?: string }
): Promise<FirebaseAuthResponse> => {
	const response = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${getFirebaseApiKey()}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...body,
				returnSecureToken: true
			})
		}
	)

	if (!response.ok) {
		const error = await response.json().catch(() => null)
		throw new Error(error?.error?.message ?? 'Firebase auth failed')
	}

	return response.json() as Promise<FirebaseAuthResponse>
}

const usernameFromEmail = (email: string): string => {
	const normalized = email
		.split('@')[0]
		?.replace(/[^a-zA-Z0-9_]/g, '')
		.slice(0, 50)
	return normalized && normalized.length >= 3 ? normalized : 'user'
}

export const loginRequest = async (body: {
	email: string
	password: string
}): Promise<CurrentUserDto> => {
	const firebaseUser = await firebaseAuthRequest('signInWithPassword', body)

	const username =
		firebaseUser.displayName ?? usernameFromEmail(firebaseUser.email ?? body.email)

	const currentUser = await syncCurrentUser(username, firebaseUser.idToken)
	persistAuth({
		accessToken: firebaseUser.idToken,
		refreshToken: firebaseUser.refreshToken,
		user: currentUser
	})
	return currentUser
}

export const registerRequest = async (body: {
	username: string
	email: string
	password: string
}): Promise<CurrentUserDto> => {
	const firebaseUser = await firebaseAuthRequest('signUp', {
		email: body.email,
		password: body.password,
		displayName: body.username
	})
	const currentUser = await syncCurrentUser(body.username, firebaseUser.idToken)
	persistAuth({
		accessToken: firebaseUser.idToken,
		refreshToken: firebaseUser.refreshToken,
		user: currentUser
	})
	return currentUser
}

export const syncCurrentUser = async (
	username: string,
	idToken?: string
): Promise<CurrentUserDto> => {
	const { data } = await apiClient.post<CurrentUserDto>('/api/auth/sync', {
		username
	}, {
		headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined
	})
	return data
}

export const getCurrentUserRequest = async (): Promise<CurrentUserDto> => {
	const { data } = await apiClient.get<CurrentUserDto>('/api/auth/me')
	return data
}

export const revokeRefreshRequest = async (): Promise<void> => {
	clearAuthStorage()
}

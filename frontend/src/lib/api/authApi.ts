import { apiClient } from '@/lib/api/client'
import type { AuthResponseDto } from '@/types/api'

export const loginRequest = async (body: {
	email: string
	password: string
}): Promise<AuthResponseDto> => {
	const { data } = await apiClient.post<AuthResponseDto>(
		'/api/auth/login',
		body
	)
	return data
}

export const registerRequest = async (body: {
	username: string
	email: string
	password: string
}): Promise<AuthResponseDto> => {
	const { data } = await apiClient.post<AuthResponseDto>(
		'/api/auth/register',
		body
	)
	return data
}

export const revokeRefreshRequest = async (): Promise<void> => {
	await apiClient.post('/api/auth/revoke', {})
}

import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig
} from 'axios'
import {
	clearAuthStorage,
	getStoredAccessToken,
	getStoredRefreshToken,
	persistAuth
} from '@/lib/tokenStorage'
import type { AuthResponseDto } from '@/types/api'

const baseURL =
	process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8080'

let refreshInFlight: Promise<string | null> | null = null

const performRefresh = async (): Promise<string | null> => {
	const refreshToken = getStoredRefreshToken()
	if (!refreshToken) return null

	try {
		const { data } = await axios.post<AuthResponseDto>(
			`${baseURL}/api/auth/refresh`,
			{ refreshToken },
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		)

		persistAuth({
			accessToken: data.token,
			refreshToken: data.refreshToken,
			user: {
				username: data.username,
				email: data.email,
				role: data.role
			}
		})

		return data.token
	} catch (error) {
		return null
	}
}

export const apiClient: AxiosInstance = axios.create({
	baseURL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = getStoredAccessToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

apiClient.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean
		}

		const status = error.response?.status
		const url = String(originalRequest?.url ?? '')

		const isRefreshCall = url.includes('/api/auth/refresh')
		const isAuthCall =
			url.includes('/api/auth/login') || url.includes('/api/auth/register')

		if (
			status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isRefreshCall &&
			!isAuthCall &&
			getStoredRefreshToken()
		) {
			originalRequest._retry = true

			try {
				if (!refreshInFlight) {
					refreshInFlight = performRefresh().finally(() => {
						refreshInFlight = null
					})
				}

				const newToken = await refreshInFlight

				if (!newToken) {
					clearAuthStorage()
					return Promise.reject(error)
				}

				originalRequest.headers.Authorization = `Bearer ${newToken}`
				return apiClient(originalRequest)
			} catch {
				clearAuthStorage()
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

export const getApiBaseUrl = (): string => baseURL

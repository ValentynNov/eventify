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
import type { AuthUserDto } from '@/types/api'

const baseURL =
	process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8080'

let refreshInFlight: Promise<string | null> | null = null

const refreshFirebaseToken = async (): Promise<string | null> => {
	const refreshToken = getStoredRefreshToken()
	const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

	if (!refreshToken || !apiKey) return null

	try {
		const params = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})

		const { data } = await axios.post<{
			id_token: string
			refresh_token: string
		}>(
			`https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
			params,
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		)

		const rawUser =
			typeof window === 'undefined'
				? null
				: window.localStorage.getItem('eventify_user')
		const user = rawUser ? (JSON.parse(rawUser) as AuthUserDto) : null

		if (user) {
			persistAuth({
				accessToken: data.id_token,
				refreshToken: data.refresh_token,
				user
			})
		}

		return data.id_token
	} catch {
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

		if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true

			if (!refreshInFlight) {
				refreshInFlight = refreshFirebaseToken().finally(() => {
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
		}

		return Promise.reject(error)
	}
)

export const getApiBaseUrl = (): string => baseURL

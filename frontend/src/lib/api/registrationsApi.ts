import { apiClient } from '@/lib/api/client'
import type {
	AdminRegistrationsQueryParams,
	PagedResponse,
	RegistrationDto,
	RegistrationStreakDto,
	RegistrationsQueryParams
} from '@/types/api'

export const fetchMyRegistrations = async (
	params?: RegistrationsQueryParams
): Promise<PagedResponse<RegistrationDto>> => {
	const { data } = await apiClient.get<PagedResponse<RegistrationDto>>(
		'/api/registrations/me',
		{ params }
	)
	return data
}

export const createRegistration = async (
	eventId: string
): Promise<RegistrationDto> => {
	const { data } = await apiClient.post<RegistrationDto>(
		`/api/registrations/events/${eventId}`
	)
	return data
}

export const fetchMyRegistrationStreak =
	async (): Promise<RegistrationStreakDto> => {
		const timezoneOffsetMinutes = new Date().getTimezoneOffset()
		const { data } = await apiClient.get<RegistrationStreakDto>(
			'/api/registrations/me/streak',
			{ params: { timezoneOffsetMinutes } }
		)
		return data
	}

export const fetchAllRegistrations = async (
	params?: AdminRegistrationsQueryParams
): Promise<PagedResponse<RegistrationDto>> => {
	const { data } = await apiClient.get<PagedResponse<RegistrationDto>>(
		'/api/registrations',
		{ params }
	)
	return data
}

export const patchRegistrationStatus = async (
	registrationId: string,
	status: RegistrationDto['status']
): Promise<RegistrationDto> => {
	const { data } = await apiClient.patch<RegistrationDto>(
		`/api/registrations/${registrationId}/status`,
		{ status }
	)
	return data
}

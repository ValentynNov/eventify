import { apiClient } from '@/lib/api/client'
import {
	denormalizeStatus,
	normalizePage,
	normalizeRegistrationDto
} from '@/lib/api/normalizers'
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
	const { data } = await apiClient.get<RegistrationDto[]>(
		'/api/registrations/me'
	)
	return {
		items: data.map(normalizeRegistrationDto),
		pageNumber: params?.pageNumber ?? 1,
		pageSize: params?.pageSize ?? data.length,
		totalCount: data.length,
		totalPages: 1
	}
}

export const createRegistration = async (
	eventId: string
): Promise<RegistrationDto> => {
	const { data } = await apiClient.post<RegistrationDto>(
		`/api/registrations/events/${eventId}`
	)
	return normalizeRegistrationDto(data)
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
	const apiParams = {
		...params,
		page: params?.pageNumber ? Math.max(0, params.pageNumber - 1) : undefined,
		pageSize: params?.pageSize,
		status: params?.status ? denormalizeStatus(params.status) : undefined,
		pageNumber: undefined
	}
	const { data } = await apiClient.get<PagedResponse<RegistrationDto>>(
		'/api/registrations',
		{ params: apiParams }
	)
	return normalizePage(data, normalizeRegistrationDto)
}

export const patchRegistrationStatus = async (
	registrationId: string,
	status: RegistrationDto['status']
): Promise<RegistrationDto> => {
	const { data } = await apiClient.patch<RegistrationDto>(
		`/api/registrations/${registrationId}/status`,
		{ status: denormalizeStatus(status) }
	)
	return normalizeRegistrationDto(data)
}

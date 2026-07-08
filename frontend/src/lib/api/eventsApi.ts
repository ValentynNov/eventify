import { apiClient } from '@/lib/api/client'
import { normalizeEventDto, normalizePage } from '@/lib/api/normalizers'
import type { EventDto, EventQueryParams, PagedResponse } from '@/types/api'

export type CreateEventPayload = {
	title: string
	description: string
	date: string
	location: string
	capacity: number
	category: string
	format: string
}

export const createEvent = async (
	payload: CreateEventPayload
): Promise<EventDto> => {
	const sanitizedPayload = {
		title: payload.title,
		description: payload.description,
		location: payload.location,
		capacity: Number(payload.capacity),
		category: payload.category.toUpperCase(),
		format: payload.format.toUpperCase(),
		eventDate: new Date(payload.date).toISOString()
	}

	const { data } = await apiClient.post<EventDto>(
		'/api/events',
		sanitizedPayload
	)
	return normalizeEventDto(data)
}

export const fetchEvents = async (
	params?: EventQueryParams
): Promise<PagedResponse<EventDto>> => {
	const apiParams = {
		...params,
		page: params?.pageNumber ? Math.max(0, params.pageNumber - 1) : undefined,
		pageSize: params?.pageSize,
		category: params?.category?.toUpperCase(),
		format: params?.format?.toUpperCase(),
		pageNumber: undefined
	}
	const { data } = await apiClient.get<PagedResponse<EventDto>>(
		'/api/events',
		{ params: apiParams }
	)
	return normalizePage(data, normalizeEventDto)
}

export const fetchEventById = async (id: string): Promise<EventDto> => {
	const { data } = await apiClient.get<EventDto>(`/api/events/${id}`)
	return normalizeEventDto(data)
}

export const updateEvent = async (
	id: string,
	payload: CreateEventPayload
): Promise<EventDto> => {
	const sanitizedPayload = {
		title: payload.title,
		description: payload.description,
		location: payload.location,
		capacity: Number(payload.capacity),
		category: payload.category.toUpperCase(),
		format: payload.format.toUpperCase(),
		eventDate: new Date(payload.date).toISOString()
	}
	const { data } = await apiClient.put<EventDto>(
		`/api/events/${id}`,
		sanitizedPayload
	)
	return normalizeEventDto(data)
}

export const deleteEvent = async (id: string): Promise<void> => {
	await apiClient.delete(`/api/events/${id}`)
}

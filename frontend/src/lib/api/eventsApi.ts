import { apiClient } from '@/lib/api/client'
import type { EventDto, EventQueryParams, PagedResponse } from '@/types/api'

const normalizeEventDto = (e: EventDto): EventDto => {
	const r = e as unknown as Record<string, unknown>
	const approved =
		typeof e.approvedRegistrationCount === 'number'
			? e.approvedRegistrationCount
			: typeof r.approvedRegistrationCount === 'number'
				? (r.approvedRegistrationCount as number)
				: typeof r.ApprovedRegistrationCount === 'number'
					? (r.ApprovedRegistrationCount as number)
					: 0
	return {
		...e,
		category: e.category || String(r.Category ?? 'meetup'),
		format: e.format || String(r.Format ?? 'offline'),
		approvedRegistrationCount: approved
	}
}

export type CreateEventPayload = {
    title: string;       
    description: string; 
    date: string;        
    location: string;    
    capacity: number;
    category: string;    
    format: string;      
}

export const createEvent = async (
    payload: CreateEventPayload
): Promise<EventDto> => {
    const sanitizedPayload = {
        ...payload,
        capacity: Number(payload.capacity),
        date: new Date(payload.date).toISOString(),
    };

    const { data } = await apiClient.post<EventDto>('/api/events', sanitizedPayload);
    return normalizeEventDto(data);
}

export const fetchEvents = async (
	params?: EventQueryParams
): Promise<PagedResponse<EventDto>> => {
	const { data } = await apiClient.get<PagedResponse<EventDto>>(
		'/api/events',
		{ params }
	)
	return {
		...data,
		items: data.items.map((item) => normalizeEventDto(item))
	}
}

export const fetchEventById = async (id: string): Promise<EventDto> => {
	const { data } = await apiClient.get<EventDto>(`/api/events/${id}`)
	return normalizeEventDto(data)
}

export const updateEvent = async (
	id: string,
	payload: CreateEventPayload
): Promise<EventDto> => {
	const { data } = await apiClient.put<EventDto>(`/api/events/${id}`, payload)
	return normalizeEventDto(data)
}

export const deleteEvent = async (id: string): Promise<void> => {
	await apiClient.delete(`/api/events/${id}`)
}

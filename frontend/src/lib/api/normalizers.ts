import type {
	ApiRegistrationStatusDto,
	EventDto,
	PagedResponse,
	RegistrationDto,
	RegistrationStatusDto
} from '@/types/api'

const statusFromApi: Record<ApiRegistrationStatusDto, RegistrationStatusDto> = {
	PENDING: 'Pending',
	APPROVED: 'Approved',
	REJECTED: 'Rejected'
}

const statusToApi: Record<RegistrationStatusDto, ApiRegistrationStatusDto> = {
	Pending: 'PENDING',
	Approved: 'APPROVED',
	Rejected: 'REJECTED'
}

export const normalizeStatus = (status: string): RegistrationStatusDto =>
	statusFromApi[status as ApiRegistrationStatusDto] ??
	(status as RegistrationStatusDto)

export const denormalizeStatus = (
	status: RegistrationStatusDto
): ApiRegistrationStatusDto => statusToApi[status]

export const normalizeEventDto = (event: EventDto): EventDto => {
	const raw = event as unknown as Record<string, unknown>
	const eventDate = String(event.eventDate ?? raw.eventDate ?? event.date ?? '')

	return {
		...event,
		date: eventDate,
		eventDate,
		category: String(event.category ?? raw.category ?? '').toLowerCase(),
		format: String(event.format ?? raw.format ?? '').toLowerCase(),
		approvedRegistrationCount:
			typeof event.approvedRegistrationCount === 'number'
				? event.approvedRegistrationCount
				: 0
	}
}

export const normalizeRegistrationDto = (
	registration: RegistrationDto
): RegistrationDto => {
	const raw = registration as unknown as Record<string, unknown>
	const event = raw.event as EventDto | undefined
	const normalizedEvent = event ? normalizeEventDto(event) : undefined

	return {
		...registration,
		status: normalizeStatus(String(registration.status)),
		eventId: registration.eventId ?? normalizedEvent?.id ?? String(raw.eventId ?? ''),
		eventTitle:
			registration.eventTitle ??
			normalizedEvent?.title ??
			String(raw.eventTitle ?? ''),
		eventCategory:
			registration.eventCategory ??
			registration.event?.category ??
			String(raw.category ?? '').toLowerCase(),
		eventFormat:
			registration.eventFormat ??
			registration.event?.format ??
			String(raw.format ?? '').toLowerCase(),
		location: registration.location ?? normalizedEvent?.location,
		capacity: registration.capacity ?? normalizedEvent?.capacity,
		eventDate: registration.eventDate ?? normalizedEvent?.date,
		event: normalizedEvent
	}
}

export const normalizePage = <T, U>(
	page: PagedResponse<T>,
	normalizeItem: (item: T) => U
): PagedResponse<U> => {
	const raw = page as unknown as Record<string, unknown>
	const backendPage = raw.page ?? raw.pageNumber

	return {
		items: page.items.map(normalizeItem),
		pageNumber:
			typeof raw.page === 'number'
				? Number(backendPage) + 1
				: Number(backendPage ?? 1),
		pageSize: Number(raw.pageSize ?? raw.size ?? page.items.length),
		totalCount: Number(raw.totalCount ?? raw.totalItems ?? page.items.length),
		totalPages: Number(raw.totalPages ?? 1),
		hasNext: Boolean(raw.hasNext),
		hasPrevious: Boolean(raw.hasPrevious)
	}
}

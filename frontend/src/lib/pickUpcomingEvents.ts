import type { EventDto } from '@/types/api'

const HOUR_MS = 60 * 60 * 1000

export const pickUpcomingEvents = (
	events: EventDto[],
	limit: number
): EventDto[] => {
	const now = Date.now() - HOUR_MS
	return [...events]
		.filter(e => new Date(e.date).getTime() >= now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, limit)
}

import type { EventDto } from '@/types/api'

const EVENT_DURATION_MS = 2 * 60 * 60 * 1000

const toIcsDate = (date: Date): string =>
	date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

const escapeIcsText = (value: string): string =>
	value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n')

const sanitizeFilename = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9а-яіїєґ_-]+/gi, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80) || 'event'

export const buildEventIcs = (event: EventDto): string => {
	const startsAt = new Date(event.date)
	const endsAt = new Date(startsAt.getTime() + EVENT_DURATION_MS)
	const createdAt = new Date(event.createdAt)
	const now = new Date()

	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Eventify//Event Calendar//UK',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'BEGIN:VEVENT',
		`UID:${event.id}@eventify`,
		`DTSTAMP:${toIcsDate(now)}`,
		`CREATED:${toIcsDate(createdAt)}`,
		`DTSTART:${toIcsDate(startsAt)}`,
		`DTEND:${toIcsDate(endsAt)}`,
		`SUMMARY:${escapeIcsText(event.title)}`,
		`DESCRIPTION:${escapeIcsText(event.description)}`,
		`LOCATION:${escapeIcsText(event.location)}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n')
}

export const downloadEventIcs = (event: EventDto): void => {
	const blob = new Blob([buildEventIcs(event)], {
		type: 'text/calendar;charset=utf-8'
	})
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `${sanitizeFilename(event.title)}.ics`
	document.body.appendChild(link)
	link.click()
	link.remove()
	URL.revokeObjectURL(url)
}

export const getGoogleCalendarUrl = (event: EventDto): string => {
	const startsAt = new Date(event.date)
	const endsAt = new Date(startsAt.getTime() + EVENT_DURATION_MS)
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.title,
		dates: `${toIcsDate(startsAt)}/${toIcsDate(endsAt)}`,
		details: event.description,
		location: event.location
	})

	return `https://calendar.google.com/calendar/render?${params.toString()}`
}

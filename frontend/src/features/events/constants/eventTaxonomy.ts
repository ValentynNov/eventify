type Option = { value: string; label: string }

export const EVENT_CATEGORY_OPTIONS: Option[] = [
	{ value: 'conference', label: 'Конференція' },
	{ value: 'meetup', label: 'Мітап' },
	{ value: 'workshop', label: 'Воркшоп' },
	{ value: 'webinar', label: 'Вебінар' },
	{ value: 'hackathon', label: 'Хакатон' }
]

export const EVENT_FORMAT_OPTIONS: Option[] = [
	{ value: 'online', label: 'Онлайн' },
	{ value: 'offline', label: 'Офлайн' },
	{ value: 'hybrid', label: 'Гібрид' }
]

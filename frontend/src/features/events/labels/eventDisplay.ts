const categoryUa: Record<string, string> = {
	conference: 'Конференція',
	meetup: 'Мітап',
	workshop: 'Воркшоп',
	hackathon: 'Хакатон'
}

const formatUa: Record<string, string> = {
	online: 'Онлайн',
	offline: 'Офлайн',
	hybrid: 'Гібрид'
}

export const categoryLabel = (slug: string): string => {
	const normalized = slug.toLowerCase()
	return categoryUa[normalized] ?? slug
}

export const formatLabel = (slug: string): string => {
	const normalized = slug.toLowerCase()
	return formatUa[normalized] ?? slug
}

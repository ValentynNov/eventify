const categoryUa: Record<string, string> = {
	conference: 'Конференція',
	meetup: 'Мітап',
	workshop: 'Воркшоп',
	webinar: 'Вебінар',
	hackathon: 'Хакатон'
}

const formatUa: Record<string, string> = {
	online: 'Онлайн',
	offline: 'Офлайн',
	hybrid: 'Гібрид'
}

export const categoryLabel = (slug: string): string =>
	categoryUa[slug] ?? slug

export const formatLabel = (slug: string): string => formatUa[slug] ?? slug
